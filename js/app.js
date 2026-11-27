/**
 * 桃園市蘆竹地政事務所 — 樓層與空間配置語音導覽核心控制腳本
 * 功能：
 * 1. 民眾自選導覽員（竹竹 / 圓圓）＋動態雙主題切換
 * 2. 雙軌導覽：樓層分頁（總覽 / 1F / 2F / 3F）＋洽公需求快搜與快捷按鈕
 * 3. 互動式平面圖熱點定位、縮放、分類篩選與全樓層自動帶逛
 * 4. 台灣常用中文語音引擎（優先挑選 zh-TW 曉臻/雲哲/Google 國語(臺灣)/美佳/雅婷/志威，
 *    並支援逐句高亮防斷音與預留靜態 MP3 音源擴充）
 */

(function () {
  "use strict";

  const DATA = window.GUIDE_DATA;
  if (!DATA) return;

  // =========================================================================
  // 應用程式狀態
  // =========================================================================
  const state = {
    guideId: "zhuzhu", // 'zhuzhu' | 'yuanyuan'
    floorId: "1f", // 'overview' | '1f' | '2f' | '3f'
    spotId: null, // null 表示該樓層總覽；否則為特定空間 ID
    categoryFilter: "all", // 'all' | 'service' | 'office' | 'facility'
    zoomLevel: 100, // 100 | 125 | 150
    speechRate: 1.0, // 0.85 | 1.0 | 1.15
    autoPlayOnSelect: true,
    isAutoTouring: false,
    fontScale: "normal", // 'normal' | 'large' | 'xlarge'
    manualVoiceUriByGuide: {
      zhuzhu: "auto",
      yuanyuan: "auto"
    }
  };

  // =========================================================================
  // DOM 參照快取
  // =========================================================================
  const dom = {
    root: document.documentElement,
    body: document.body,
    headerBrandAvatar: document.getElementById("headerBrandAvatar"),
    fontLargeBtn: document.getElementById("fontLargeBtn"),
    fontXLargeBtn: document.getElementById("fontXLargeBtn"),
    welcomeAudioBtn: document.getElementById("welcomeAudioBtn"),
    spotSearchInput: document.getElementById("spotSearchInput"),
    searchResults: document.getElementById("searchResults"),
    quickActionsList: document.getElementById("quickActionsList"),
    floorTabs: document.querySelectorAll(".floor-tab"),
    overviewPanel: document.getElementById("overviewPanel"),
    overviewWelcomeText: document.getElementById("overviewWelcomeText"),
    playOverviewAllBtn: document.getElementById("playOverviewAllBtn"),
    buildingStack: document.getElementById("buildingStack"),
    floorMapPanel: document.getElementById("floorMapPanel"),
    currentFloorBadge: document.getElementById("currentFloorBadge"),
    currentFloorTitle: document.getElementById("currentFloorTitle"),
    currentFloorEn: document.getElementById("currentFloorEn"),
    floorOverviewSpeakBtn: document.getElementById("floorOverviewSpeakBtn"),
    autoTourBtn: document.getElementById("autoTourBtn"),
    zoomOutBtn: document.getElementById("zoomOutBtn"),
    zoomInBtn: document.getElementById("zoomInBtn"),
    zoomLevelText: document.getElementById("zoomLevelText"),
    filterPills: document.querySelectorAll(".filter-pill"),
    mapViewport: document.getElementById("mapViewport"),
    mapCanvas: document.getElementById("mapCanvas"),
    floorPlanImage: document.getElementById("floorPlanImage"),
    hotspotsLayer: document.getElementById("hotspotsLayer"),
    spotCountBadge: document.getElementById("spotCountBadge"),
    floorSpotsGrid: document.getElementById("floorSpotsGrid"),
    mascotStage: document.getElementById("mascotStage"),
    mascotPortrait: document.getElementById("mascotPortrait"),
    mascotName: document.getElementById("mascotName"),
    mascotVoiceTag: document.getElementById("mascotVoiceTag"),
    mascotRoleText: document.getElementById("mascotRoleText"),
    speakingStatusText: document.getElementById("speakingStatusText"),
    prevSpotBtn: document.getElementById("prevSpotBtn"),
    playPauseBtn: document.getElementById("playPauseBtn"),
    playPauseIcon: document.getElementById("playPauseIcon"),
    playPauseLabel: document.getElementById("playPauseLabel"),
    stopAudioBtn: document.getElementById("stopAudioBtn"),
    nextSpotBtn: document.getElementById("nextSpotBtn"),
    audioProgressBar: document.getElementById("audioProgressBar"),
    speedBtns: document.querySelectorAll(".speed-btn"),
    autoPlayOnSelect: document.getElementById("autoPlayOnSelect"),
    voiceSelect: document.getElementById("voiceSelect"),
    testVoiceBtn: document.getElementById("testVoiceBtn"),
    voiceQualityHint: document.getElementById("voiceQualityHint"),
    activeSpotFloorBadge: document.getElementById("activeSpotFloorBadge"),
    activeSpotCategoryBadge: document.getElementById("activeSpotCategoryBadge"),
    tourStepCounter: document.getElementById("tourStepCounter"),
    activeSpotTitle: document.getElementById("activeSpotTitle"),
    activeSpotEn: document.getElementById("activeSpotEn"),
    speechBubble: document.getElementById("speechBubble"),
    spotLocationHint: document.getElementById("spotLocationHint"),
    spotServicesList: document.getElementById("spotServicesList"),
    spotTipBox: document.getElementById("spotTipBox"),
    spotTipText: document.getElementById("spotTipText"),
    guideColumn: document.getElementById("guideColumn"),
    dockAvatar: document.getElementById("dockAvatar"),
    dockFloorBadge: document.getElementById("dockFloorBadge"),
    dockStatus: document.getElementById("dockStatus"),
    dockSpotTitle: document.getElementById("dockSpotTitle"),
    dockPlayBtn: document.getElementById("dockPlayBtn"),
    dockJumpBtn: document.getElementById("dockJumpBtn")
  };

  // =========================================================================
  // 台灣中文語音引擎（支援預錄 MP3 優先播放 ＋ Web Speech API 台灣聲線自動優選）
  // =========================================================================
  class TaiwanVoiceEngine {
    constructor() {
      this.synth = "speechSynthesis" in window ? window.speechSynthesis : null;
      this.audioEl = new Audio();
      this.usingAudioFile = false;
      this.voices = [];
      this.isSpeaking = false;
      this.isPaused = false;
      this.sentences = [];
      this.currentIndex = 0;
      this.playSessionId = 0;
      this.chunkTimer = null;
      this.currentGuideId = "zhuzhu";
      this.rate = 1.0;
      this.onStateChange = () => {};
      this.onSentenceChange = () => {};
      this.onComplete = () => {};
      this.onVoicesReady = () => {};

      if (this.synth) {
        this.loadVoices();
        if (typeof this.synth.onvoiceschanged !== "undefined") {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
        // 部分瀏覽器非同步載入語音清單，補一次延遲重新偵測
        setTimeout(() => this.loadVoices(), 450);
      }
    }

    loadVoices() {
      if (!this.synth) return;
      const list = this.synth.getVoices() || [];
      if (list.length > 0) {
        this.voices = list;
        this.onVoicesReady(this.getTaiwanVoices());
      }
    }

    normalizeLang(lang) {
      return (lang || "").trim().toLowerCase().replace("_", "-");
    }

    isStrictZhTW(voice) {
      const lang = this.normalizeLang(voice.lang);
      return lang === "zh-tw" || lang.startsWith("zh-hant-tw");
    }

    isTaiwanVoice(voice) {
      const lang = this.normalizeLang(voice.lang);
      const name = (voice.name || "").toLowerCase();
      return (
        this.isStrictZhTW(voice) ||
        lang.startsWith("zh-hant") ||
        name.includes("taiwan") ||
        name.includes("臺灣") ||
        name.includes("台灣") ||
        name.includes("國語") ||
        name.includes("hsiaochen") ||
        name.includes("yunjhe") ||
        name.includes("hsiaoyu") ||
        name.includes("yating") ||
        name.includes("zhiwei") ||
        name.includes("hanhan") ||
        name.includes("meijia")
      );
    }

    // 判斷聲音自然度等級：3 = AI 自然語音 (Neural/Natural)、2 = 雲端/系統自然聲線 (Google/Apple)、1 = 傳統離線語音
    getNaturalnessTier(voice) {
      if (!voice) return 0;
      const name = (voice.name || "").toLowerCase();
      if (
        name.includes("natural") ||
        name.includes("neural") ||
        name.includes("hsiaochen") ||
        name.includes("yunjhe") ||
        name.includes("hsiaoyu") ||
        name.includes("曉臻") ||
        name.includes("雲哲") ||
        name.includes("曉雨")
      ) {
        return 3;
      }
      if (
        name.includes("google") ||
        name.includes("meijia") ||
        name.includes("美佳") ||
        name.includes("li-mu") ||
        name.includes("eddy") ||
        name.includes("reed") ||
        name.includes("shelley") ||
        name.includes("sandy") ||
        voice.localService === false
      ) {
        return 2;
      }
      return 1;
    }

    getTaiwanVoices() {
      // 優先嚴格篩選 lang === 'zh-TW' 的所有台灣聲音
      const strictTw = this.voices.filter((v) => this.isStrictZhTW(v));
      const pool =
        strictTw.length > 0
          ? strictTw
          : this.voices.filter((v) => this.isTaiwanVoice(v));

      const finalList =
        pool.length > 0
          ? pool
          : this.voices.filter((v) =>
              this.normalizeLang(v.lang).startsWith("zh")
            );

      // 依自然度由高到低排序，讓使用者在下拉選單最上方就看到最自然的聲音
      return [...finalList].sort((a, b) => {
        const tierDiff = this.getNaturalnessTier(b) - this.getNaturalnessTier(a);
        if (tierDiff !== 0) return tierDiff;
        return (a.name || "").localeCompare(b.name || "");
      });
    }

    // 依照角色指定聲線直接鎖定（竹竹→雅婷、圓圓→志威）；無該聲線之裝置再依自然度備援
    pickBestVoice(guideId) {
      const manualUri = state.manualVoiceUriByGuide[guideId];
      if (manualUri && manualUri !== "auto") {
        const chosen = this.voices.find((v) => v.voiceURI === manualUri);
        if (chosen) {
          return {
            voice: chosen,
            isGenderMatched: true,
            isManual: true,
            isLocked: false,
            tier: this.getNaturalnessTier(chosen)
          };
        }
      }

      const guide = DATA.guides[guideId];
      const candidates = this.getTaiwanVoices();
      if (candidates.length === 0) {
        return { voice: null, isGenderMatched: false, isManual: false, isLocked: false, tier: 0 };
      }

      // 1. 直接鎖定角色指定聲線（竹竹 -> Yating 雅婷；圓圓 -> Zhiwei 志威）
      const lockedKeywords = guide.voicePrefs.lockedKeywords || [];
      if (lockedKeywords.length > 0) {
        const lockedMatch = candidates.find((v) => {
          const nameLower = (v.name || "").toLowerCase();
          return lockedKeywords.some((kw) => nameLower.includes(kw.toLowerCase()));
        });
        if (lockedMatch) {
          return {
            voice: lockedMatch,
            isGenderMatched: true,
            isManual: false,
            isLocked: true,
            tier: this.getNaturalnessTier(lockedMatch)
          };
        }
      }

      // 2. 若裝置沒有雅婷／志威（如手機 iOS / Android），退回最適合的台灣 zh-TW 聲線
      const prefs = guide.voicePrefs.preferredNames;
      let bestVoice = candidates[0];
      let bestScore = -1;

      candidates.forEach((v) => {
        let score = 0;
        const nameLower = (v.name || "").toLowerCase();
        const tier = this.getNaturalnessTier(v);

        if (this.isStrictZhTW(v)) score += 100;
        if (tier === 3) score += 260;
        else if (tier === 2) score += 180;
        else score += 60;

        prefs.forEach((keyword, idx) => {
          if (nameLower.includes(keyword.toLowerCase())) {
            score += 140 - idx * 8;
          }
        });

        if (guide.voicePrefs.gender === "male") {
          if (/yunjhe|雲哲|zhiwei|志威|danny|li-mu|eddy|reed/i.test(nameLower)) {
            score += 45;
          } else if (/hsiaochen|hsiaoyu|yating|hanhan|meijia|shelley|sandy/i.test(nameLower)) {
            score -= 20;
          }
        } else {
          if (/hsiaochen|曉臻|hsiaoyu|曉雨|meijia|美佳|yating|雅婷|hanhan|涵涵|shelley|sandy/i.test(nameLower)) {
            score += 45;
          } else if (/yunjhe|zhiwei|danny|li-mu|eddy|reed/i.test(nameLower)) {
            score -= 20;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestVoice = v;
        }
      });

      const matchedName = (bestVoice.name || "").toLowerCase();
      const isGenderMatched =
        guide.voicePrefs.gender === "male"
          ? /yunjhe|zhiwei|danny|li-mu|eddy|reed|雲哲|志威/i.test(matchedName)
          : /hsiaochen|hsiaoyu|yating|hanhan|meijia|曉臻|曉雨|雅婷|涵涵|美佳|國語/i.test(
              matchedName
            );

      return {
        voice: bestVoice,
        isGenderMatched,
        isManual: false,
        isLocked: false,
        tier: this.getNaturalnessTier(bestVoice)
      };
    }

    formatVoiceDisplayName(voice, includeRaw = false) {
      if (!voice) return "瀏覽器預設台灣中文";
      const n = voice.name || "";
      const tier = this.getNaturalnessTier(voice);
      const badge = tier === 3 ? "★ 自然AI" : tier === 2 ? "★ 自然" : "內建";
      let friendly = n;
      if (/HsiaoChen/i.test(n)) friendly = "Microsoft 曉臻（台灣女聲）";
      else if (/YunJhe/i.test(n)) friendly = "Microsoft 雲哲（台灣男聲）";
      else if (/HsiaoYu/i.test(n)) friendly = "Microsoft 曉雨（台灣女聲）";
      else if (/Yating/i.test(n)) friendly = "Microsoft 雅婷（台灣女聲）";
      else if (/Zhiwei/i.test(n)) friendly = "Microsoft 志威（台灣男聲）";
      else if (/Hanhan/i.test(n)) friendly = "Microsoft 涵涵（台灣女聲）";
      else if (/Google.*臺灣|Google.*TW|Google 國語/i.test(n)) friendly = "Google 國語（臺灣）";
      else if (/Meijia/i.test(n)) friendly = "Apple 美佳（台灣女聲）";

      if (includeRaw && friendly !== n) {
        return `[${badge}] ${friendly} · ${n}`;
      }
      return `[${badge}] ${friendly}`;
    }

    splitSentences(text) {
      const cleaned = (text || "").trim();
      if (!cleaned) return [];
      const parts = cleaned.match(/[^。！？；!?;]+[。！？；!?;]?/g);
      return parts ? parts.map((s) => s.trim()).filter(Boolean) : [cleaned];
    }

    hashText(text) {
      const normalized = String(text || "").trim().replace(/\s+/g, " ");
      let h = 0x811c9dc5;
      for (let i = 0; i < normalized.length; i++) {
        h ^= normalized.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
      }
      return (h >>> 0).toString(16).padStart(8, "0");
    }

    hasValidStaticAudio(guideId, audioKey, text) {
      const manifest = window.AUDIO_MANIFEST && window.AUDIO_MANIFEST[guideId];
      if (!audioKey || !manifest || !manifest[audioKey]) return null;
      const entry = manifest[audioKey];
      if (typeof entry === "string") {
        return entry;
      }
      // 防呆機制：只有當預錄 MP3 的文字指紋與目前台詞一致時才播放，避免改字後還唸舊台詞
      if (entry.file && entry.hash === this.hashText(text)) {
        return entry.file;
      }
      return null;
    }

    speak(text, guideId, rate = 1.0, audioKey = null) {
      this.stop(true);
      this.sentences = this.splitSentences(text);
      if (this.sentences.length === 0) return;

      this.currentGuideId = guideId;
      this.rate = rate;
      this.currentIndex = 0;
      this.playSessionId += 1;
      const session = this.playSessionId;

      // 優先播放文字版本相符的預錄 MP3 音檔（手機與電腦皆享一致的自然台灣 AI 人聲）
      const matchedFile = this.hasValidStaticAudio(guideId, audioKey, text);
      if (matchedFile) {
        this._playStaticAudio(
          DATA.guides[guideId].audioBasePath + matchedFile,
          session,
          () => this._speakWithWebSpeech(session)
        );
        return;
      }

      this._speakWithWebSpeech(session);
    }

    _playStaticAudio(src, session, fallbackFn) {
      this.usingAudioFile = true;
      this.isSpeaking = true;
      this.isPaused = false;
      this.audioEl.src = src;
      this.audioEl.playbackRate = this.rate;

      this.audioEl.ontimeupdate = () => {
        if (session !== this.playSessionId || !this.audioEl.duration) return;
        const ratio = this.audioEl.currentTime / this.audioEl.duration;
        const idx = Math.min(
          this.sentences.length - 1,
          Math.floor(ratio * this.sentences.length)
        );
        this.onSentenceChange(idx, this.sentences.length);
      };

      this.audioEl.onended = () => {
        if (session !== this.playSessionId) return;
        this.usingAudioFile = false;
        this.isSpeaking = false;
        this.isPaused = false;
        this.onSentenceChange(-1, this.sentences.length);
        this.onStateChange({
          speaking: false,
          paused: false,
          message: "導覽播放完畢，點選其他空間繼續聽介紹"
        });
        this.onComplete();
      };

      this.audioEl.onerror = () => {
        if (session !== this.playSessionId) return;
        this.usingAudioFile = false;
        fallbackFn();
      };

      this.onStateChange({
        speaking: true,
        paused: false,
        message: `${DATA.guides[this.currentGuideId].name}正在為您語音導覽中…`
      });

      this.audioEl.play().catch(() => {
        if (session !== this.playSessionId) return;
        this.usingAudioFile = false;
        fallbackFn();
      });
    }

    _speakWithWebSpeech(session) {
      if (!this.synth) {
        this.isSpeaking = false;
        this.onStateChange({
          speaking: false,
          paused: false,
          message: "此瀏覽器不支援語音朗讀功能，請直接閱讀文字導覽"
        });
        return;
      }

      this.usingAudioFile = false;
      this.isSpeaking = true;
      this.isPaused = false;
      this.onStateChange({
        speaking: true,
        paused: false,
        message: `${DATA.guides[this.currentGuideId].name}正在為您語音導覽中…`
      });

      this._speakChunk(session);
    }

    _speakChunk(session) {
      if (session !== this.playSessionId) return;
      if (this.currentIndex >= this.sentences.length) {
        this.isSpeaking = false;
        this.isPaused = false;
        this.onSentenceChange(-1, this.sentences.length);
        this.onStateChange({
          speaking: false,
          paused: false,
          message: "導覽播放完畢，點選其他空間繼續聽介紹"
        });
        this.onComplete();
        return;
      }

      const sentence = this.sentences[this.currentIndex];
      const utter = new SpeechSynthesisUtterance(sentence);
      utter.lang = "zh-TW";

      const { voice, isGenderMatched, isManual } = this.pickBestVoice(this.currentGuideId);
      if (voice) {
        utter.voice = voice;
      }

      const guide = DATA.guides[this.currentGuideId];
      utter.rate = Math.max(0.7, Math.min(1.4, this.rate + guide.voicePrefs.fallbackRateOffset));
      // 若使用者手動指定聲線或已配對正確自然聲線，維持原音高 1.0 以確保最自然；僅在共用單一聲線時做極細微音高區隔
      utter.pitch = isManual || isGenderMatched ? 1.0 : guide.voicePrefs.fallbackPitch;

      this.onSentenceChange(this.currentIndex, this.sentences.length);

      utter.onend = () => {
        if (session !== this.playSessionId) return;
        this.currentIndex += 1;
        // 句與句之間保留約 160ms 自然換氣停頓，避免語氣倉促生硬
        this.chunkTimer = setTimeout(() => this._speakChunk(session), 160);
      };

      utter.onerror = (ev) => {
        if (session !== this.playSessionId) return;
        if (ev.error === "interrupted" || ev.error === "canceled") return;
        this.isSpeaking = false;
        this.isPaused = false;
        this.onStateChange({
          speaking: false,
          paused: false,
          message: "語音播放中斷，請再點擊一次播放按鈕"
        });
      };

      this.synth.speak(utter);
    }

    pause() {
      if (!this.isSpeaking || this.isPaused) return;
      if (this.usingAudioFile) {
        this.audioEl.pause();
      } else if (this.synth) {
        this.synth.pause();
      }
      this.isPaused = true;
      this.onStateChange({
        speaking: true,
        paused: true,
        message: "語音已暫停，點擊繼續播放"
      });
    }

    resume() {
      if (!this.isSpeaking || !this.isPaused) return;
      if (this.usingAudioFile) {
        this.audioEl.play().catch(() => {});
      } else if (this.synth) {
        this.synth.resume();
      }
      this.isPaused = false;
      this.onStateChange({
        speaking: true,
        paused: false,
        message: `${DATA.guides[this.currentGuideId].name}繼續為您導覽中…`
      });
    }

    stop(silent = false) {
      this.playSessionId += 1;
      if (this.chunkTimer) {
        clearTimeout(this.chunkTimer);
        this.chunkTimer = null;
      }
      if (this.usingAudioFile) {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.usingAudioFile = false;
      }
      if (this.synth) {
        this.synth.cancel();
      }
      this.isSpeaking = false;
      this.isPaused = false;
      if (!silent) {
        this.onSentenceChange(-1, this.sentences.length || 1);
        this.onStateChange({
          speaking: false,
          paused: false,
          message: "已停止播放，點擊按鈕重新開始導覽"
        });
      }
    }
  }

  const voiceEngine = new TaiwanVoiceEngine();

  // =========================================================================
  // 取得目前焦點物件（樓層總覽 / 單一空間 / 全館總覽）
  // =========================================================================
  function getCurrentContext() {
    if (state.floorId === "overview") {
      return {
        isOverviewAll: true,
        isFloorOverview: false,
        floorLabel: "全館",
        categoryLabel: "大樓總覽",
        title: "桃園市蘆竹地政事務所｜全館導覽",
        englishName: "Luzhu Land Office — 1F to 3F Directory",
        script: DATA.guides[state.guideId].greeting + " " + DATA.agency.welcomeSummary,
        locationHint: "本所共分為一樓（登記與櫃檯）、二樓（地價與行政）、三樓（測量與資訊）",
        services: [
          "1F：服務台、全功能櫃檯（謄本、規費、收件）、稅務櫃檯、登記課、哺集乳室",
          "2F：地價課（實價登錄）、行政課、檔案閱覽處、人事室、會計室、會議室",
          "3F：測量課（土地鑑界分割）、補正櫃台、資訊課、電腦教室、地籍圖庫",
          "全館 1F～3F 皆設有電梯、茶水間、男女化妝室與性別友善廁所"
        ],
        tip: "您可以直接點選上方『熱門洽公按鈕』，系統會立刻幫您定位到對應樓層與櫃檯！",
        stepText: "全館總覽"
      };
    }

    const floor = DATA.floors[state.floorId];
    if (!state.spotId) {
      return {
        isOverviewAll: false,
        isFloorOverview: true,
        floorLabel: floor.shortLabel,
        categoryLabel: "樓層總覽",
        title: floor.title,
        englishName: floor.englishTitle,
        script: floor.overviewScript[state.guideId],
        locationHint: floor.summary,
        services: floor.highlights.map((h) => `重點區域：${h}`),
        tip: "點擊左側平面圖任一彩色圓點，或點選『帶逛本層』，就能逐一聽取每個空間的詳細介紹！",
        stepText: `${floor.shortLabel} 總覽`
      };
    }

    const idx = floor.spots.findIndex((s) => s.id === state.spotId);
    const spot = floor.spots[idx] || floor.spots[0];
    return {
      isOverviewAll: false,
      isFloorOverview: false,
      floorLabel: floor.shortLabel,
      categoryLabel: spot.categoryLabel,
      title: spot.name,
      englishName: spot.englishName,
      script: spot.script[state.guideId],
      locationHint: spot.locationHint,
      services: spot.services,
      tip: spot.tip,
      stepText: `第 ${idx + 1} / ${floor.spots.length} 站`
    };
  }

  // =========================================================================
  // 畫面渲染函式
  // =========================================================================
  function renderQuickActions() {
    dom.quickActionsList.innerHTML = "";
    DATA.quickActions.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-action-pill";
      btn.innerHTML = `
        <span aria-hidden="true">${item.icon}</span>
        <span>${item.label}</span>
        <span class="quick-tag">${item.tag}</span>
      `;
      btn.addEventListener("click", () => {
        // 若是性別友善廁所，優先導引至目前所在樓層的廁所
        let targetFloor = item.floorId;
        let targetSpot = item.spotId;
        if (item.label === "性別友善廁所" && state.floorId !== "overview") {
          targetFloor = state.floorId;
          targetSpot = `${state.floorId}-restroom`;
        }
        stopAutoTour();
        selectLocation(targetFloor, targetSpot, state.autoPlayOnSelect);
      });
      dom.quickActionsList.appendChild(btn);
    });
  }

  function renderBuildingOverview() {
    dom.overviewWelcomeText.textContent = DATA.agency.welcomeSummary;
    dom.buildingStack.innerHTML = "";

    // 由上往下呈現 3F -> 2F -> 1F，符合建築立面直覺
    ["3f", "2f", "1f"].forEach((fId) => {
      const floor = DATA.floors[fId];
      const card = document.createElement("div");
      card.className = "building-floor-card";
      card.innerHTML = `
        <div class="building-floor-num">
          <strong>${floor.shortLabel}</strong>
          <span>${floor.spots.length} 個空間</span>
        </div>
        <div class="building-floor-info">
          <h3>${floor.title}</h3>
          <p>${floor.summary}</p>
          <div class="building-floor-tags">
            ${floor.highlights
              .map((tag) => `<span class="building-floor-tag">${tag}</span>`)
              .join("")}
          </div>
        </div>
        <div class="building-floor-cta">
          <img class="building-thumb" src="${floor.image}" alt="${floor.title}平面圖縮圖" />
          <button type="button" class="enter-floor-btn" data-enter-floor="${fId}">進入 ${floor.shortLabel} 導覽 →</button>
        </div>
      `;
      card.querySelector(".enter-floor-btn").addEventListener("click", () => {
        stopAutoTour();
        selectLocation(fId, null, state.autoPlayOnSelect);
      });
      dom.buildingStack.appendChild(card);
    });
  }

  function renderGuideUI() {
    const guide = DATA.guides[state.guideId];
    dom.body.setAttribute("data-guide", guide.id);
    dom.headerBrandAvatar.src = guide.avatar;
    dom.mascotPortrait.src = guide.avatar;
    dom.mascotPortrait.alt = `導覽員${guide.name}`;
    dom.mascotName.textContent = guide.name;
    dom.mascotVoiceTag.textContent = guide.badge;
    dom.mascotRoleText.textContent = guide.role;
    if (dom.dockAvatar) dom.dockAvatar.src = guide.avatar;
    if (dom.dockStatus) dom.dockStatus.textContent = `${guide.name}隨時待命`;

    // 同步頂部與右側所有角色切換按鈕狀態
    document.querySelectorAll("[data-select-guide]").forEach((btn) => {
      const isMatch = btn.getAttribute("data-select-guide") === guide.id;
      btn.classList.toggle("active", isMatch);
      if (btn.hasAttribute("aria-pressed")) {
        btn.setAttribute("aria-pressed", String(isMatch));
      }
      if (btn.hasAttribute("aria-checked")) {
        btn.setAttribute("aria-checked", String(isMatch));
      }
    });

    populateVoiceDropdown();
  }

  function populateVoiceDropdown() {
    const twVoices = voiceEngine.getTaiwanVoices();
    const saved = state.manualVoiceUriByGuide[state.guideId] || "auto";
    // 先取得該角色鎖定預設聲線（暫時忽略手動覆寫，供第一個選項顯示）
    const prevManual = state.manualVoiceUriByGuide[state.guideId];
    state.manualVoiceUriByGuide[state.guideId] = "auto";
    const { voice: autoVoice, isLocked } = voiceEngine.pickBestVoice(state.guideId);
    state.manualVoiceUriByGuide[state.guideId] = prevManual;

    const guideName = DATA.guides[state.guideId].name;

    dom.voiceSelect.innerHTML = "";
    const autoOpt = document.createElement("option");
    autoOpt.value = "auto";
    autoOpt.textContent = autoVoice
      ? `${isLocked ? "角色鎖定" : "自動配對"}：${voiceEngine.formatVoiceDisplayName(autoVoice)}`
      : `自動挑選 ${guideName} 台灣中文聲線`;
    dom.voiceSelect.appendChild(autoOpt);

    twVoices.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v.voiceURI;
      opt.textContent = voiceEngine.formatVoiceDisplayName(v, true);
      dom.voiceSelect.appendChild(opt);
    });

    dom.voiceSelect.value = saved;
    if (dom.voiceSelect.value !== saved) {
      dom.voiceSelect.value = "auto";
      state.manualVoiceUriByGuide[state.guideId] = "auto";
    }

    updateVoiceQualityHint(twVoices);
  }

  function updateVoiceQualityHint(twVoices) {
    if (!dom.voiceQualityHint) return;
    const { voice: activeVoice, isLocked, isManual } = voiceEngine.pickBestVoice(state.guideId);
    const total = twVoices.length;
    const guide = DATA.guides[state.guideId];
    const hasStaticAudio = Boolean(
      window.AUDIO_MANIFEST &&
        window.AUDIO_MANIFEST[state.guideId] &&
        Object.keys(window.AUDIO_MANIFEST[state.guideId]).length > 0
    );

    dom.voiceQualityHint.classList.remove("is-natural", "is-legacy");

    if (total === 0) {
      if (hasStaticAudio) {
        dom.voiceQualityHint.classList.add("is-natural");
        dom.voiceQualityHint.textContent = `已啟用「${guide.name}」預錄台灣 AI 語音 MP3，所有手機與電腦皆可直接播放！`;
      } else {
        dom.voiceQualityHint.classList.add("is-legacy");
        dom.voiceQualityHint.textContent =
          "尚未偵測到 zh-TW 語音清單，請確認裝置已安裝繁體中文（台灣）語音包。";
      }
      return;
    }

    if (isLocked && activeVoice) {
      dom.voiceQualityHint.classList.add("is-natural");
      dom.voiceQualityHint.textContent = hasStaticAudio
        ? `目前優先使用「${guide.name}」預錄台灣 AI 語音（手機／電腦皆適用）；下方可測試裝置備援聲線（已鎖定 ${guide.voicePrefs.lockedLabel}）。`
        : `已為「${guide.name}」鎖定專屬聲線：${guide.voicePrefs.lockedLabel}（共偵測 ${total} 組 zh-TW 聲線，可隨時改選試聽）。`;
    } else if (isManual && activeVoice) {
      dom.voiceQualityHint.classList.add("is-natural");
      dom.voiceQualityHint.textContent = `目前手動測試裝置聲線：${activeVoice.name}（重新點選竹竹／圓圓將恢復預設音檔與鎖定聲線）。`;
    } else if (activeVoice) {
      dom.voiceQualityHint.classList.add("is-natural");
      dom.voiceQualityHint.textContent = hasStaticAudio
        ? `目前優先使用「${guide.name}」預錄台灣 AI 語音（手機與電腦皆有男／女專屬聲線）；裝置備援為 ${activeVoice.name}。`
        : `此裝置未內建「${guide.voicePrefs.lockedLabel}」，已自動改用台灣聲線：${activeVoice.name}。`;
    }
  }

  function previewSelectedVoice() {
    const guide = DATA.guides[state.guideId];
    const { voice } = voiceEngine.pickBestVoice(state.guideId);
    const shortVoiceName = voice
      ? voiceEngine.formatVoiceDisplayName(voice).replace(/^\[[^\]]+\]\s*/, "")
      : "台灣中文";
    const sampleText = `哈囉您好！我是${guide.name}，現在為您測試的是${shortVoiceName}。歡迎蒞臨桃園市蘆竹地政事務所！`;
    voiceEngine.speak(sampleText, state.guideId, state.speechRate);
  }

  function renderFloorView() {
    // 頁籤狀態
    dom.floorTabs.forEach((tab) => {
      const active = tab.getAttribute("data-floor") === state.floorId;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    if (state.floorId === "overview") {
      dom.overviewPanel.classList.remove("hidden");
      dom.floorMapPanel.classList.add("hidden");
      return;
    }

    dom.overviewPanel.classList.add("hidden");
    dom.floorMapPanel.classList.remove("hidden");

    const floor = DATA.floors[state.floorId];
    dom.currentFloorBadge.textContent = floor.shortLabel;
    dom.currentFloorTitle.textContent = floor.title;
    dom.currentFloorEn.textContent = floor.englishTitle;
    dom.floorPlanImage.src = floor.image;
    dom.floorPlanImage.alt = `${floor.title} 平面配置圖`;

    renderHotspotsAndList(floor);
  }

  function renderHotspotsAndList(floor) {
    dom.hotspotsLayer.innerHTML = "";
    dom.floorSpotsGrid.innerHTML = "";

    const filteredCount = floor.spots.filter(
      (s) => state.categoryFilter === "all" || s.category === state.categoryFilter
    ).length;
    dom.spotCountBadge.textContent = `${filteredCount} 處`;

    floor.spots.forEach((spot, index) => {
      const num = index + 1;
      const isSelected = state.spotId === spot.id;
      const matchesFilter =
        state.categoryFilter === "all" || spot.category === state.categoryFilter;

      // 1. 地圖熱點 Pin（依座標靠邊自動對齊提示框，避免小螢幕邊緣裁切）
      const edgeClasses = [];
      if (spot.x <= 18) edgeClasses.push("edge-left");
      else if (spot.x >= 78) edgeClasses.push("edge-right");
      if (spot.y <= 14) edgeClasses.push("edge-top");

      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = `hotspot-pin${isSelected ? " active" : ""}${
        !matchesFilter ? " dimmed" : ""
      }${edgeClasses.length ? " " + edgeClasses.join(" ") : ""}`;
      pin.dataset.cat = spot.category;
      pin.dataset.spotId = spot.id;
      pin.style.left = `${spot.x}%`;
      pin.style.top = `${spot.y}%`;
      pin.setAttribute("aria-label", `${floor.shortLabel} ${spot.name}`);
      pin.innerHTML = `
        <span>${num}</span>
        <span class="hotspot-tooltip">${spot.name}</span>
      `;
      pin.addEventListener("click", () => {
        stopAutoTour();
        selectLocation(floor.id, spot.id, state.autoPlayOnSelect);
      });
      dom.hotspotsLayer.appendChild(pin);

      // 2. 下方空間索引卡片
      if (matchesFilter) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `spot-chip-card${isSelected ? " active" : ""}`;
        chip.innerHTML = `
          <span class="spot-num-dot" data-cat="${spot.category}">${num}</span>
          <span class="spot-chip-text">
            <span class="spot-chip-name">${spot.name}</span>
            <span class="spot-chip-cat">${spot.categoryLabel}</span>
          </span>
        `;
        chip.addEventListener("click", () => {
          stopAutoTour();
          selectLocation(floor.id, spot.id, state.autoPlayOnSelect);
        });
        dom.floorSpotsGrid.appendChild(chip);
      }
    });
  }

  function renderDialogueAndDetails() {
    const ctx = getCurrentContext();
    dom.activeSpotFloorBadge.textContent = ctx.floorLabel;
    dom.activeSpotCategoryBadge.textContent = ctx.categoryLabel;
    dom.tourStepCounter.textContent = ctx.stepText;
    dom.activeSpotTitle.textContent = ctx.title;
    dom.activeSpotEn.textContent = ctx.englishName;
    if (dom.dockFloorBadge) dom.dockFloorBadge.textContent = ctx.floorLabel;
    if (dom.dockSpotTitle) dom.dockSpotTitle.textContent = ctx.title;

    // 切句放入對話框以支援即時高亮
    const sentences = voiceEngine.splitSentences(ctx.script);
    dom.speechBubble.innerHTML = sentences
      .map(
        (s, idx) =>
          `<span class="speech-sentence" data-sentence-idx="${idx}">${escapeHtml(s)}</span>`
      )
      .join("");

    dom.spotLocationHint.textContent = ctx.locationHint;
    dom.spotServicesList.innerHTML = ctx.services
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    if (ctx.tip) {
      dom.spotTipBox.classList.remove("hidden");
      dom.spotTipText.textContent = ctx.tip;
    } else {
      dom.spotTipBox.classList.add("hidden");
    }

    dom.audioProgressBar.style.width = "0%";
  }

  function highlightSentence(activeIdx, total) {
    const spans = dom.speechBubble.querySelectorAll(".speech-sentence");
    spans.forEach((span, idx) => {
      span.classList.toggle("speaking-now", idx === activeIdx);
    });
    if (activeIdx >= 0 && total > 0) {
      const pct = Math.min(100, Math.round(((activeIdx + 1) / total) * 100));
      dom.audioProgressBar.style.width = `${pct}%`;
    } else if (activeIdx === -1) {
      dom.audioProgressBar.style.width = "100%";
    }
  }

  function updateAudioButtonUI({ speaking, paused, message }) {
    const isActivelySpeaking = speaking && !paused;
    dom.mascotStage.classList.toggle("is-speaking", isActivelySpeaking);
    dom.speakingStatusText.textContent = message;

    if (isActivelySpeaking) {
      dom.playPauseIcon.textContent = "⏸";
      dom.playPauseLabel.textContent = "暫停導覽";
      if (dom.dockPlayBtn) dom.dockPlayBtn.textContent = "⏸ 暫停";
      if (dom.dockStatus) dom.dockStatus.textContent = `${DATA.guides[state.guideId].name}語音導覽中…`;
    } else if (speaking && paused) {
      dom.playPauseIcon.textContent = "▶";
      dom.playPauseLabel.textContent = "繼續播放";
      if (dom.dockPlayBtn) dom.dockPlayBtn.textContent = "▶ 繼續";
      if (dom.dockStatus) dom.dockStatus.textContent = "語音已暫停";
    } else {
      dom.playPauseIcon.textContent = "▶";
      dom.playPauseLabel.textContent = "開始語音導覽";
      if (dom.dockPlayBtn) dom.dockPlayBtn.textContent = "▶ 播放";
      if (dom.dockStatus) dom.dockStatus.textContent = `${DATA.guides[state.guideId].name}隨時待命`;
    }
  }

  // =========================================================================
  // 核心互動操作
  // =========================================================================
  function selectLocation(floorId, spotId, shouldSpeak = false) {
    state.floorId = floorId;
    state.spotId = spotId;

    voiceEngine.stop(true);
    updateAudioButtonUI({
      speaking: false,
      paused: false,
      message: "準備就緒，點擊下方按鈕開始導覽"
    });

    renderFloorView();
    renderDialogueAndDetails();
    syncUrlHash();

    if (shouldSpeak) {
      playCurrentScript();
    }
  }

  function selectGuide(guideId, greetUser = false) {
    if (!DATA.guides[guideId]) return;
    const wasSpeaking = voiceEngine.isSpeaking;
    state.guideId = guideId;
    // 切換導覽員時直接鎖定回該角色的預設專屬聲線（竹竹→雅婷、圓圓→志威）
    state.manualVoiceUriByGuide[guideId] = "auto";

    voiceEngine.stop(true);
    renderGuideUI();
    renderDialogueAndDetails();
    syncUrlHash();

    if (greetUser) {
      const guide = DATA.guides[guideId];
      // 暫時以招呼語朗讀並顯示於對話框或直接朗讀目前項目
      voiceEngine.speak(guide.greeting, state.guideId, state.speechRate, "welcome");
    } else if (wasSpeaking) {
      playCurrentScript();
    } else {
      updateAudioButtonUI({
        speaking: false,
        paused: false,
        message: `已切換為${DATA.guides[guideId].name}為您服務`
      });
    }
  }

  function playCurrentScript() {
    const ctx = getCurrentContext();
    const audioKey = state.spotId || `overview-${state.floorId}`;
    voiceEngine.speak(ctx.script, state.guideId, state.speechRate, audioKey);
  }

  function stepSpot(direction) {
    stopAutoTour();
    if (state.floorId === "overview") {
      selectLocation("1f", DATA.floors["1f"].spots[0].id, state.autoPlayOnSelect);
      return;
    }

    const floor = DATA.floors[state.floorId];
    const spots = floor.spots;
    if (!state.spotId) {
      const target = direction > 0 ? spots[0] : spots[spots.length - 1];
      selectLocation(floor.id, target.id, state.autoPlayOnSelect);
      return;
    }

    const currIdx = spots.findIndex((s) => s.id === state.spotId);
    const nextIdx = (currIdx + direction + spots.length) % spots.length;
    selectLocation(floor.id, spots[nextIdx].id, state.autoPlayOnSelect);
  }

  function startAutoTour() {
    if (state.floorId === "overview") {
      state.floorId = "1f";
    }
    state.isAutoTouring = true;
    dom.autoTourBtn.classList.add("is-active");
    dom.autoTourBtn.innerHTML = "<span>⏹</span> 停止帶逛";

    const floor = DATA.floors[state.floorId];
    // 從該樓層總覽開始，接著依序逛完每一站
    selectLocation(floor.id, null, true);
  }

  function stopAutoTour() {
    if (!state.isAutoTouring) return;
    state.isAutoTouring = false;
    dom.autoTourBtn.classList.remove("is-active");
    dom.autoTourBtn.innerHTML = "<span>🚶</span> 帶逛本層";
  }

  function handleAutoTourNext() {
    if (!state.isAutoTouring || state.floorId === "overview") return;
    const floor = DATA.floors[state.floorId];
    if (!state.spotId) {
      selectLocation(floor.id, floor.spots[0].id, true);
      return;
    }
    const currIdx = floor.spots.findIndex((s) => s.id === state.spotId);
    if (currIdx >= 0 && currIdx + 1 < floor.spots.length) {
      selectLocation(floor.id, floor.spots[currIdx + 1].id, true);
    } else {
      stopAutoTour();
      updateAudioButtonUI({
        speaking: false,
        paused: false,
        message: `${floor.shortLabel} 整層導覽已完成！歡迎切換其他樓層`
      });
    }
  }

  function setZoom(newZoom) {
    state.zoomLevel = Math.max(100, Math.min(160, newZoom));
    dom.mapCanvas.style.width = `${state.zoomLevel}%`;
    dom.zoomLevelText.textContent = `${state.zoomLevel}%`;
  }

  // =========================================================================
  // 搜尋功能（涵蓋所有課室名稱、英文名、業務關鍵字）
  // =========================================================================
  function runSearch(keyword) {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      dom.searchResults.classList.add("hidden");
      dom.searchResults.innerHTML = "";
      return;
    }

    const matches = [];
    ["1f", "2f", "3f"].forEach((fId) => {
      const floor = DATA.floors[fId];
      floor.spots.forEach((spot) => {
        const haystack = [
          spot.name,
          spot.englishName,
          spot.categoryLabel,
          spot.locationHint,
          spot.tip,
          ...spot.services
        ]
          .join(" ")
          .toLowerCase();

        if (haystack.includes(q)) {
          matches.push({ floor, spot });
        }
      });
    });

    dom.searchResults.innerHTML = "";
    if (matches.length === 0) {
      dom.searchResults.innerHTML = `<div class="search-result-item"><span class="search-result-desc">找不到「${escapeHtml(
        keyword
      )}」相關空間，建議改搜尋「謄本、登記、地價、測量、廁所」</span></div>`;
    } else {
      matches.slice(0, 10).forEach(({ floor, spot }) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "search-result-item";
        item.setAttribute("role", "option");
        item.innerHTML = `
          <div>
            <div class="search-result-title">${escapeHtml(spot.name)}</div>
            <div class="search-result-desc">${escapeHtml(spot.services[0] || spot.locationHint)}</div>
          </div>
          <span class="search-result-floor">${floor.shortLabel}</span>
        `;
        item.addEventListener("click", () => {
          dom.searchResults.classList.add("hidden");
          dom.spotSearchInput.value = "";
          stopAutoTour();
          selectLocation(floor.id, spot.id, state.autoPlayOnSelect);
        });
        dom.searchResults.appendChild(item);
      });
    }
    dom.searchResults.classList.remove("hidden");
  }

  // =========================================================================
  // URL 參數支援（方便各樓層印製專屬 QR Code，如 ?floor=3f&guide=yuanyuan）
  // =========================================================================
  function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("guide");
    const f = params.get("floor");
    const s = params.get("spot");

    if (g && DATA.guides[g]) state.guideId = g;
    if (f && (f === "overview" || DATA.floors[f])) state.floorId = f;
    if (s && state.floorId !== "overview") {
      const exists = DATA.floors[state.floorId].spots.some((item) => item.id === s);
      if (exists) state.spotId = s;
    }
  }

  function syncUrlHash() {
    try {
      const params = new URLSearchParams();
      params.set("floor", state.floorId);
      if (state.spotId) params.set("spot", state.spotId);
      params.set("guide", state.guideId);
      const nextUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", nextUrl);
    } catch (_) {
      // file:// 協議下部分瀏覽器限制 replaceState，靜默忽略即可
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function applyFontScale(scale) {
    state.fontScale = scale;
    dom.root.classList.toggle("font-large", scale === "large");
    dom.root.classList.toggle("font-xlarge", scale === "xlarge");

    if (dom.fontLargeBtn) {
      dom.fontLargeBtn.setAttribute("aria-pressed", String(scale === "large"));
    }
    if (dom.fontXLargeBtn) {
      dom.fontXLargeBtn.setAttribute("aria-pressed", String(scale === "xlarge"));
    }
    try {
      localStorage.setItem("luzhu_guide_font_scale", scale);
    } catch (_) {}
  }

  // =========================================================================
  // 事件綁定與初始化
  // =========================================================================
  function bindEvents() {
    // 角色切換按鈕（頂部膠囊 + 右側導覽台卡片）
    document.querySelectorAll("[data-select-guide]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetGuide = btn.getAttribute("data-select-guide");
        if (targetGuide !== state.guideId) {
          selectGuide(targetGuide, false);
        }
      });
    });

    // 歡迎導覽語音按鈕
    dom.welcomeAudioBtn.addEventListener("click", () => {
      stopAutoTour();
      const guide = DATA.guides[state.guideId];
      // 在對話氣泡顯示歡迎詞並播放
      dom.activeSpotFloorBadge.textContent = "歡迎";
      dom.activeSpotCategoryBadge.textContent = guide.name;
      dom.tourStepCounter.textContent = "導覽員招呼";
      dom.activeSpotTitle.textContent = `${guide.name}的歡迎導覽`;
      dom.activeSpotEn.textContent = "Welcome to Luzhu Land Office";
      const sentences = voiceEngine.splitSentences(guide.greeting);
      dom.speechBubble.innerHTML = sentences
        .map(
          (s, idx) =>
            `<span class="speech-sentence" data-sentence-idx="${idx}">${escapeHtml(s)}</span>`
        )
        .join("");
      voiceEngine.speak(guide.greeting, state.guideId, state.speechRate, "welcome");
    });

    // 長輩友善大字模式（A+ 放大 / A++ 特大，再點一次目前按鈕即恢復標準）
    [dom.fontLargeBtn, dom.fontXLargeBtn].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-font-scale");
        const nextScale = state.fontScale === target ? "normal" : target;
        applyFontScale(nextScale);
      });
    });

    // 樓層分頁切換
    dom.floorTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        stopAutoTour();
        const floorId = tab.getAttribute("data-floor");
        state.categoryFilter = "all";
        dom.filterPills.forEach((p) =>
          p.classList.toggle("active", p.getAttribute("data-category") === "all")
        );
        selectLocation(floorId, null, false);
      });
    });

    // 總覽頁「聽全館導覽簡介」
    dom.playOverviewAllBtn.addEventListener("click", () => {
      stopAutoTour();
      playCurrentScript();
    });

    // 單層「本層總覽語音」
    dom.floorOverviewSpeakBtn.addEventListener("click", () => {
      stopAutoTour();
      selectLocation(state.floorId, null, true);
    });

    // 單層「帶逛本層」
    dom.autoTourBtn.addEventListener("click", () => {
      if (state.isAutoTouring) {
        stopAutoTour();
        voiceEngine.stop();
      } else {
        startAutoTour();
      }
    });

    // 地圖縮放
    dom.zoomInBtn.addEventListener("click", () => setZoom(state.zoomLevel + 20));
    dom.zoomOutBtn.addEventListener("click", () => setZoom(state.zoomLevel - 20));

    // 空間分類篩選
    dom.filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        state.categoryFilter = pill.getAttribute("data-category");
        dom.filterPills.forEach((p) => p.classList.toggle("active", p === pill));
        if (state.floorId !== "overview") {
          renderHotspotsAndList(DATA.floors[state.floorId]);
        }
      });
    });

    // 語音播放 / 暫停 / 停止 / 上下站
    dom.playPauseBtn.addEventListener("click", () => {
      if (voiceEngine.isSpeaking && !voiceEngine.isPaused) {
        voiceEngine.pause();
      } else if (voiceEngine.isSpeaking && voiceEngine.isPaused) {
        voiceEngine.resume();
      } else {
        playCurrentScript();
      }
    });

    dom.stopAudioBtn.addEventListener("click", () => {
      stopAutoTour();
      voiceEngine.stop();
    });

    dom.prevSpotBtn.addEventListener("click", () => stepSpot(-1));
    dom.nextSpotBtn.addEventListener("click", () => stepSpot(1));

    // 語速調整
    dom.speedBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        state.speechRate = parseFloat(btn.getAttribute("data-rate")) || 1.0;
        dom.speedBtns.forEach((b) => b.classList.toggle("active", b === btn));
        if (voiceEngine.isSpeaking && !voiceEngine.isPaused) {
          playCurrentScript();
        }
      });
    });

    // 點選即播開關
    dom.autoPlayOnSelect.addEventListener("change", (e) => {
      state.autoPlayOnSelect = e.target.checked;
    });

    // 手動挑選台灣 zh-TW 聲線：切換後更新提示並立即試聽
    dom.voiceSelect.addEventListener("change", (e) => {
      state.manualVoiceUriByGuide[state.guideId] = e.target.value;
      updateVoiceQualityHint(voiceEngine.getTaiwanVoices());
      stopAutoTour();
      previewSelectedVoice();
    });

    // 試聽目前選擇的台灣聲線
    if (dom.testVoiceBtn) {
      dom.testVoiceBtn.addEventListener("click", () => {
        stopAutoTour();
        previewSelectedVoice();
      });
    }

    // 搜尋輸入與點擊外部關閉
    dom.spotSearchInput.addEventListener("input", (e) => runSearch(e.target.value));
    dom.spotSearchInput.addEventListener("focus", (e) => {
      if (e.target.value.trim()) runSearch(e.target.value);
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box-wrap")) {
        dom.searchResults.classList.add("hidden");
      }
    });

    // 手機底部迷你語音導覽列按鈕
    if (dom.dockPlayBtn) {
      dom.dockPlayBtn.addEventListener("click", () => {
        dom.playPauseBtn.click();
      });
    }
    if (dom.dockJumpBtn && dom.guideColumn) {
      dom.dockJumpBtn.addEventListener("click", () => {
        dom.guideColumn.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // 語音引擎回呼
    voiceEngine.onStateChange = updateAudioButtonUI;
    voiceEngine.onSentenceChange = highlightSentence;
    voiceEngine.onComplete = () => {
      if (state.isAutoTouring) {
        setTimeout(() => handleAutoTourNext(), 700);
      }
    };
    voiceEngine.onVoicesReady = () => {
      populateVoiceDropdown();
    };
  }

  function init() {
    try {
      const savedScale = localStorage.getItem("luzhu_guide_font_scale");
      if (savedScale === "large" || savedScale === "xlarge") {
        applyFontScale(savedScale);
      }
    } catch (_) {}
    restoreFromUrl();
    renderQuickActions();
    renderBuildingOverview();
    renderGuideUI();
    renderFloorView();
    renderDialogueAndDetails();
    bindEvents();
  }

  init();
})();
