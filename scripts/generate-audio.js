/**
 * 桃園市蘆竹地政事務所 — 導覽語音 MP3 自動化增量生成腳本
 * 功能：
 * 1. 讀取 js/data.js 內的所有導覽台詞（歡迎詞、全館總覽、1F~3F總覽與 32 個空間）
 * 2. 計算每段台詞的 FNV-1a 雜湊指紋，僅針對「新增或文字有修改」的段落重新生成 MP3
 * 3. 竹竹使用台灣自然女聲 (zh-TW-HsiaoChenNeural)，圓圓使用台灣自然男聲 (zh-TW-YunJheNeural)
 * 4. 產出 js/audio-manifest.js 供前端比對文字版本並優先播放靜態 MP3
 */

const fs = require("fs");
const path = require("path");
const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "js", "data.js");
const MANIFEST_PATH = path.join(ROOT, "js", "audio-manifest.js");
const AUDIO_ROOT = path.join(ROOT, "assets", "audio");

const VOICE_CANDIDATES = {
  zhuzhu: ["zh-TW-HsiaoChenNeural", "zh-TW-HsiaoYuNeural"], // 曉臻（台灣自然女聲）
  yuanyuan: ["zh-TW-YunJheNeural", "zh-CN-YunxiNeural"] // 優先台灣雲哲，若端點無回應自動備援陽光自然男聲雲希
};

const FORCE_ALL = process.argv.includes("--force");

/**
 * 與前端 app.js 完全一致的 FNV-1a 32-bit 文字指紋函式
 */
function hashText(text) {
  const normalized = String(text || "").trim().replace(/\s+/g, " ");
  let h = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    h ^= normalized.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function loadGuideData() {
  global.window = {};
  delete require.cache[require.resolve(DATA_PATH)];
  require(DATA_PATH);
  return global.window.GUIDE_DATA;
}

function loadExistingManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return {};
  try {
    global.window = {};
    delete require.cache[require.resolve(MANIFEST_PATH)];
    require(MANIFEST_PATH);
    return global.window.AUDIO_MANIFEST || {};
  } catch (_) {
    return {};
  }
}

function collectScripts(data) {
  const tasks = [];
  const guideIds = Object.keys(data.guides);

  guideIds.forEach((guideId) => {
    const guide = data.guides[guideId];

    tasks.push({
      guideId,
      key: "welcome",
      text: guide.greeting
    });

    tasks.push({
      guideId,
      key: "overview-overview",
      text: `${guide.greeting} ${data.agency.welcomeSummary}`
    });

    ["1f", "2f", "3f"].forEach((floorId) => {
      const floor = data.floors[floorId];
      tasks.push({
        guideId,
        key: `overview-${floorId}`,
        text: floor.overviewScript[guideId]
      });

      floor.spots.forEach((spot) => {
        tasks.push({
          guideId,
          key: spot.id,
          text: spot.script[guideId]
        });
      });
    });
  });

  return tasks;
}

async function synthesizeToMp3(voiceName, text, outPath) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const dir = path.dirname(outPath);
  const tmpDir = path.join(dir, `.tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    const { audioFilePath } = await tts.toFile(tmpDir, text);
    fs.renameSync(audioFilePath, outPath);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (typeof tts.close === "function") {
      try {
        tts.close();
      } catch (_) {}
    }
  }
}

async function synthesizeWithRetry(voiceName, text, outPath, retries = 5) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await synthesizeToMp3(voiceName, text, outPath);
      return;
    } catch (err) {
      lastErr = err;
      console.warn(`  [重試 ${attempt}/${retries}] ${path.basename(outPath)} 失敗: ${err.message}`);
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw lastErr;
}

function writeManifest(manifestObj) {
  manifestObj.generatedAt = new Date().toISOString();
  const manifestJs = `/**
 * 自動生成的導覽語音 MP3 清單與文字指紋檔（請勿手動修改）
 * 由 scripts/generate-audio.js 自動維護
 */
window.AUDIO_MANIFEST = ${JSON.stringify(manifestObj, null, 2)};
`;
  fs.writeFileSync(MANIFEST_PATH, manifestJs, "utf8");
}

async function resolveAvailableVoice(guideId) {
  const candidates = VOICE_CANDIDATES[guideId] || [];
  const tmpDir = path.join(AUDIO_ROOT, guideId);
  fs.mkdirSync(tmpDir, { recursive: true });
  const probePath = path.join(tmpDir, ".probe.mp3");

  for (const voiceName of candidates) {
    try {
      await synthesizeToMp3(voiceName, "測試語音。", probePath);
      if (fs.existsSync(probePath)) fs.unlinkSync(probePath);
      console.log(`導覽員 [${guideId}] 採用聲線：${voiceName}`);
      return voiceName;
    } catch (err) {
      if (fs.existsSync(probePath)) fs.unlinkSync(probePath);
      console.warn(`聲線 ${voiceName} 目前無法連線 (${err.message})，嘗試備援聲線...`);
    }
  }
  throw new Error(`找不到可用的語音聲線 (${guideId})`);
}

async function main() {
  const data = loadGuideData();
  const prevManifest = loadExistingManifest();
  const tasks = collectScripts(data);

  const activeVoices = {};
  for (const guideId of Object.keys(VOICE_CANDIDATES)) {
    fs.mkdirSync(path.join(AUDIO_ROOT, guideId), { recursive: true });
  }

  const nextManifest = {
    generatedAt: new Date().toISOString(),
    voices: { ...((prevManifest && prevManifest.voices) || {}) },
    zhuzhu: {},
    yuanyuan: {}
  };

  let generatedCount = 0;
  let skippedCount = 0;

  console.log(`共偵測 ${tasks.length} 段導覽台詞，開始比對文字指紋...`);

  for (let i = 0; i < tasks.length; i++) {
    const { guideId, key, text } = tasks[i];
    const hash = hashText(text);
    const fileName = `${key}.mp3`;
    const filePath = path.join(AUDIO_ROOT, guideId, fileName);
    const prevEntry = prevManifest[guideId] && prevManifest[guideId][key];

    const isUpToDate =
      !FORCE_ALL &&
      prevEntry &&
      prevEntry.hash === hash &&
      prevEntry.file === fileName &&
      fs.existsSync(filePath) &&
      fs.statSync(filePath).size > 500;

    if (isUpToDate) {
      skippedCount += 1;
    } else {
      if (!activeVoices[guideId]) {
        activeVoices[guideId] = await resolveAvailableVoice(guideId);
        nextManifest.voices[guideId] = activeVoices[guideId];
      }
      const voiceName = activeVoices[guideId];
      console.log(`[${i + 1}/${tasks.length}] 生成 ${guideId}/${fileName} (${voiceName})...`);
      await synthesizeWithRetry(voiceName, text, filePath);
      generatedCount += 1;
      await new Promise((r) => setTimeout(r, 150));
    }

    nextManifest[guideId][key] = {
      file: fileName,
      hash
    };
    if (!isUpToDate) {
      writeManifest(nextManifest);
    }
  }

  writeManifest(nextManifest);

  console.log(`\n完成！本次新生成/更新 ${generatedCount} 個 MP3，略過未變更 ${skippedCount} 個。`);
  console.log(`已更新音檔清單：${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("生成語音失敗:", err);
  process.exit(1);
});
