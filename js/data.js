/**
 * 桃園市蘆竹地政事務所 — 樓層與空間配置語音導覽資料檔
 * 統一管理：角色設定（竹竹、圓圓）、1F～3F 樓層總覽、精準地圖熱點座標（%）、
 * 各課室一般地政常見業務介紹、洽公快捷標籤與語音口播文稿。
 */

window.GUIDE_DATA = {
  agency: {
    name: "桃園市蘆竹地政事務所",
    shortName: "蘆竹地政",
    serviceArea: "服務轄區：蘆竹區・大園區",
    sourceUrl: "https://www.luzhu-land.tycg.gov.tw/cp.aspx?n=14391",
    welcomeSummary:
      "歡迎蒞臨桃園市蘆竹地政事務所！本所提供一樓登記與全功能櫃檯、二樓地價與行政服務、三樓土地測量與資訊空間，點擊樓層或上方洽公按鈕，就能聽導覽員為您指引方向喔！"
  },

  guides: {
    zhuzhu: {
      id: "zhuzhu",
      name: "竹竹",
      role: "親切服務導覽員",
      badge: "台灣女聲",
      themeColor: "#1f8a5b",
      themeLight: "#e8f7ef",
      themeDark: "#146340",
      avatar: "assets/images/mascot-zhuzhu.png",
      tagline: "手拿土地登記簿與捲尺，用最親切的語氣帶您輕鬆找到每個櫃檯！",
      greeting:
        "哈囉！我是竹竹，歡迎來到桃園市蘆竹地政事務所！無論您是要領取謄本、辦理登記、找測量課還是尋找哺集乳室，只要點選地圖或按鈕，我就馬上為您語音帶路喔！",
      voicePrefs: {
        gender: "female",
        // 優先直接鎖定 Microsoft 雅婷（台灣女聲）；無此語音之行動裝置再依序備援
        lockedKeywords: ["Yating", "雅婷"],
        lockedLabel: "Microsoft 雅婷（台灣女聲）",
        preferredNames: [
          "Yating",
          "雅婷",
          "HsiaoChen",
          "曉臻",
          "HsiaoYu",
          "曉雨",
          "Google 國語（臺灣）",
          "Google 國語",
          "Meijia",
          "美佳",
          "Hanhan",
          "涵涵"
        ],
        fallbackPitch: 1.03,
        fallbackRateOffset: 0
      },
      // 若未來放入預錄 MP3，將自動優先播放此資料夾內的 <spotId>.mp3
      audioBasePath: "assets/audio/zhuzhu/"
    },
    yuanyuan: {
      id: "yuanyuan",
      name: "圓圓",
      role: "陽光測繪導覽員",
      badge: "台灣男聲",
      themeColor: "#1d6fa5",
      themeLight: "#e8f3fb",
      themeDark: "#144e78",
      avatar: "assets/images/mascot-yuanyuan.png",
      tagline: "戴著飛機頭飾、手持測繪儀器與轄區地圖，帶您快速掌握大樓動線！",
      greeting:
        "嗨！大家好，我是圓圓！歡迎來到蘆竹地政事務所，服務範圍涵蓋蘆竹區與大園區。點選各樓層平面圖上的空間，讓我用清楚的語音為您介紹動線與各項地政業務吧！",
      voicePrefs: {
        gender: "male",
        // 優先直接鎖定 Microsoft 志威（台灣男聲）；無此語音之行動裝置再依序備援
        lockedKeywords: ["Zhiwei", "志威"],
        lockedLabel: "Microsoft 志威（台灣男聲）",
        preferredNames: [
          "Zhiwei",
          "志威",
          "YunJhe",
          "雲哲",
          "Danny",
          "Li-mu",
          "Eddy",
          "Reed",
          "Google 國語（臺灣）",
          "Google 國語"
        ],
        fallbackPitch: 0.94,
        fallbackRateOffset: 0
      },
      audioBasePath: "assets/audio/yuanyuan/"
    }
  },

  // 雙軌導覽：常用洽公需求與便民設施一鍵定位
  quickActions: [
    {
      label: "領謄本・收件繳費",
      icon: "📄",
      floorId: "1f",
      spotId: "1f-counter",
      tag: "1F"
    },
    {
      label: "買賣過戶・登記業務",
      icon: "🏠",
      floorId: "1f",
      spotId: "1f-registration",
      tag: "1F"
    },
    {
      label: "稅務櫃檯",
      icon: "💰",
      floorId: "1f",
      spotId: "1f-tax",
      tag: "1F"
    },
    {
      label: "實價登錄・地價查詢",
      icon: "📊",
      floorId: "2f",
      spotId: "2f-landvalue",
      tag: "2F"
    },
    {
      label: "檔案閱覽申請",
      icon: "📁",
      floorId: "2f",
      spotId: "2f-archives-reading",
      tag: "2F"
    },
    {
      label: "土地測量・鑑界分割",
      icon: "📐",
      floorId: "3f",
      spotId: "3f-survey",
      tag: "3F"
    },
    {
      label: "測量案件補正",
      icon: "✍️",
      floorId: "3f",
      spotId: "3f-supplement",
      tag: "3F"
    },
    {
      label: "哺集乳室",
      icon: "🤱",
      floorId: "1f",
      spotId: "1f-nursing",
      tag: "1F"
    },
    {
      label: "性別友善廁所",
      icon: "♿",
      floorId: "1f",
      spotId: "1f-restroom",
      tag: "各樓層"
    }
  ],

  floors: {
    "1f": {
      id: "1f",
      shortLabel: "1F",
      title: "一樓｜登記與便民櫃檯",
      englishTitle: "1st Floor — Registration & General Services",
      summary:
        "一樓為最主要的民眾洽公大廳，涵蓋服務台、民眾等候區、全功能櫃檯（謄本、規費與收件）、稅務櫃檯、登記課與地籍倉庫，並設有溫馨的哺集乳室及性別友善廁所。",
      image: "assets/images/floor-1f.jpg",
      overviewScript: {
        zhuzhu:
          "歡迎來到一樓大廳！我是竹竹。從大門入口進來，左側設有溫馨的哺集乳室，右側是樓梯、電梯、茶水間與男女及性別友善廁所。正前方就是服務台與寬敞的民眾等候區，往裡面走則是全功能櫃檯、稅務櫃檯、登記課與地籍倉庫。大部分領取謄本、繳費、收件及不動產登記業務都在這一樓辦理喔！",
        yuanyuan:
          "這裡是一樓平面空間，我是圓圓為您導覽。進入一樓大廳後，左手邊有哺集乳室，右手邊配置電梯、樓梯與各類化妝室。正前方為服務台與民眾等候區，順著櫃檯動線往內依序是全功能櫃檯、稅務櫃檯，後方大片辦公區域為登記課，最內側則是地籍倉庫。需要查詢路線時，直接點選地圖上的圓點就能聽詳細介紹！"
      },
      highlights: ["全功能櫃檯", "登記課", "稅務櫃檯", "服務台", "哺集乳室"],
      spots: [
        {
          id: "1f-service",
          name: "服務台",
          englishName: "Information Desk",
          category: "service",
          categoryLabel: "洽公服務",
          x: 9.0,
          y: 51.5,
          locationHint: "一樓大門入口進入後正前方左側",
          services: [
            "洽公引導、業務諮詢與抽號協助",
            "提供各式地政申請書表與填寫範例",
            "簡易案件初檢、老花眼鏡與愛心輪椅借用",
            "引導民眾至對應櫃檯或樓層洽辦業務"
          ],
          tip: "如果不確定要抽哪一種號碼牌或要到哪一樓辦理，先詢問服務台人員最省時！",
          script: {
            zhuzhu:
              "這裡是位於一樓入口前方的服務台。第一次來辦業務不用緊張，服務台提供業務諮詢、各式申請書表，以及抽取號碼牌與愛心協助，有問題都可以先來這裡詢問喔！",
            yuanyuan:
              "您現在看到的是位於一樓入口左側的服務台。現場人員能協助您確認應備文件、領取申請書表，並指引您前往正確的櫃檯或樓層，讓洽公流程更順暢。"
          }
        },
        {
          id: "1f-waiting",
          name: "民眾等候區",
          englishName: "Waiting Area",
          category: "facility",
          categoryLabel: "便民設施",
          x: 11.0,
          y: 36.5,
          locationHint: "一樓服務台後方、全功能櫃檯正前方",
          services: [
            "舒適座椅與叫號螢幕顯示",
            "地政宣導資訊與便民表單填寫桌",
            "鄰近全功能櫃檯與稅務櫃檯，方便即時叫號辦理"
          ],
          tip: "等候叫號時，可以先在填寫區備妥申請書與身分證件。",
          script: {
            zhuzhu:
              "這裡是寬敞明亮的民眾等候區，就在服務台與全功能櫃檯之間。您在等候叫號的同時，可以先坐著休息，或利用書寫桌把申請書填寫完成喔！",
            yuanyuan:
              "民眾等候區緊鄰全功能櫃檯與稅務櫃檯，備有充足座位與叫號顯示，方便民眾舒適候件、隨時注意辦理進度。"
          }
        },
        {
          id: "1f-counter",
          name: "全功能櫃檯（謄本・規費・收件）",
          englishName: "General Service Counter",
          category: "service",
          categoryLabel: "洽公服務",
          x: 20.8,
          y: 36.5,
          locationHint: "一樓民眾等候區右側一整排櫃檯",
          services: [
            "核發土地、建物登記謄本、地籍圖謄本與建物測量成果圖",
            "受理土地及建物登記、測量案件收件與領件",
            "地政規費計收、開立收據與跨縣市代收代寄服務",
            "簡易登記案件隨到隨辦與住址隱匿申請"
          ],
          tip: "申請各類謄本請攜帶國民身分證正本，並確認土地地段地號或建物門牌。",
          script: {
            zhuzhu:
              "這裡是最忙碌也最方便的全功能櫃檯！無論您要申請土地與建物謄本、繳納地政規費、辦理登記或測量案件收件與領件，以及跨所、跨縣市代收服務，都可以在這裡一次搞定喔！",
            yuanyuan:
              "全功能櫃檯整合了謄本核發、規費收繳、案件收件與領件等核心窗口。請攜帶身分證件與相關地號資料，依叫號順序前往櫃檯辦理即可。"
          }
        },
        {
          id: "1f-tax",
          name: "稅務櫃檯",
          englishName: "Tax Counter",
          category: "service",
          categoryLabel: "洽公服務",
          x: 21.3,
          y: 22.8,
          locationHint: "一樓全功能櫃檯最北側（靠近地籍倉庫方向）",
          services: [
            "土地增值稅、契稅申報諮詢與查欠作業",
            "不動產移轉相關稅務證明核發與補單",
            "稅務與地政跨機關一站式便民服務"
          ],
          tip: "辦理買賣或贈與過戶時，若需查詢地方稅欠稅狀況，可就近於稅務櫃檯洽詢。",
          script: {
            zhuzhu:
              "順著全功能櫃檯往裡面走，就是稅務櫃檯囉！這裡提供土地增值稅、契稅與查欠等相關稅務諮詢服務，讓您辦理不動產過戶時不用多跑一趟！",
            yuanyuan:
              "稅務櫃檯位於全功能櫃檯內側，協助民眾辦理不動產移轉常見的稅務查詢、查欠與相關證明服務，大幅節省往返稅捐機關與地政機關的時間。"
          }
        },
        {
          id: "1f-registration",
          name: "登記課",
          englishName: "Land Registration Section",
          category: "office",
          categoryLabel: "業務課室",
          x: 38.0,
          y: 34.0,
          locationHint: "一樓全功能櫃檯後方中央辦公區",
          services: [
            "土地及建物所有權移轉登記（買賣、贈與、繼承、分割等）",
            "抵押權設定、內容變更及塗銷登記審查",
            "建物所有權第一次登記（保存登記）與書狀補給、換給",
            "預告登記、信託登記、地籍異動即時通及不動產糾紛協談"
          ],
          tip: "若登記案件收到補正通知，或需要了解繼承、買賣過戶審查進度，可洽詢登記課承辦人員。",
          script: {
            zhuzhu:
              "這裡是登記課，也是我竹竹最熟悉的區域喔！登記課負責審查所有的土地與建物登記案件，像是買賣過戶、繼承、贈與、抵押權設定與塗銷、權狀補發，以及保護產權的地籍異動即時通，都在這裡把關！",
            yuanyuan:
              "登記課位於一樓中央辦公區，專責不動產產權審查與登載作業，涵蓋買賣移轉、繼承登記、抵押權設定塗銷及權狀核發。民眾若對案件審查或補正內容有疑問，可在此洽詢承辦人員。"
          }
        },
        {
          id: "1f-cadaster",
          name: "地籍倉庫",
          englishName: "Cadaster Storage",
          category: "office",
          categoryLabel: "機關庫房",
          x: 24.5,
          y: 9.0,
          locationHint: "一樓最內側（北側）區域",
          services: [
            "典藏歷史土地登記簿冊與歷年登記申請書案卷",
            "提供登記課調閱原始登記資料與查證使用",
            "屬機關內部檔案庫房，非開放民眾自行進入區域"
          ],
          tip: "如需申請閱覽或抄錄歷史登記案卷，請先至服務台或二樓檔案閱覽處依規定提出申請。",
          script: {
            zhuzhu:
              "位於一樓最內側的是地籍倉庫，裡面妥善保存了珍貴的歷年土地登記案卷與簿冊。為了維護檔案安全，這裡屬於工作人員專用庫房，若需申請閱覽資料，會有專人協助調卷喔！",
            yuanyuan:
              "地籍倉庫位在一樓最上方區域，專門典藏不動產登記原始案卷與歷史簿冊。此空間為管制庫房，民眾如需申請調閱案卷，請由櫃檯依規定申請辦理。"
          }
        },
        {
          id: "1f-nursing",
          name: "哺集乳室",
          englishName: "Breastfeeding Room",
          category: "facility",
          categoryLabel: "便民設施",
          x: 6.0,
          y: 68.0,
          locationHint: "一樓大門入口左側獨立空間",
          services: [
            "提供家長安全、隱密且乾淨的哺乳與集乳空間",
            "備有舒適座椅、洗手台、尿布檯與飲水設備",
            "友善親子洽公環境，歡迎有需要的家長安心使用"
          ],
          tip: "從一樓大門進來左手邊即可看見明顯的粉紅色哺集乳室標誌。",
          script: {
            zhuzhu:
              "帶小寶貝來洽公的家長看這邊！從一樓大門進來左手邊就是哺集乳室，裡面空間乾淨隱密，備有尿布檯與舒適設備，讓爸爸媽媽都能安心照顧寶寶喔！",
            yuanyuan:
              "哺集乳室設於一樓大門入口左側，提供獨立且溫馨的育兒照護環境，方便攜帶嬰幼兒前來洽公的民眾隨時使用。"
          }
        },
        {
          id: "1f-elevator",
          name: "電梯與樓梯（動線起點）",
          englishName: "Elevator & Stairs",
          category: "facility",
          categoryLabel: "交通動線",
          x: 34.5,
          y: 65.5,
          locationHint: "一樓大廳右側梯廳（圖面紅圈「你現在位置」處）",
          services: [
            "雙部無障礙電梯直達二樓（地價、行政）與三樓（測量、資訊）",
            "主樓梯與後方安全逃生梯連接各樓層",
            "梯廳旁設有消防栓箱與緊急逃生方向標示"
          ],
          tip: "推嬰兒車、使用輪椅或長輩上樓，歡迎多加利用電梯前往二樓與三樓。",
          script: {
            zhuzhu:
              "這裡是一樓的電梯與樓梯口，也是平面圖上紅圈標示的『你現在位置』。要到二樓地價課、檔案閱覽處，或三樓測量課洽公的朋友，從這裡搭乘電梯最輕鬆喔！",
            yuanyuan:
              "梯廳位於一樓大廳右側，設有兩座電梯與寬敞樓梯，可快速通往二樓與三樓。緊急狀況時，也請留意圖面上紅色箭頭所指示的緊急逃生方向。"
          }
        },
        {
          id: "1f-restroom",
          name: "性別友善廁所・化妝室・茶水間",
          englishName: "Restrooms & Tea Room",
          category: "facility",
          categoryLabel: "便民設施",
          x: 44.5,
          y: 65.0,
          locationHint: "一樓電梯旁右側區域（後方北側亦設有男女化妝室）",
          services: [
            "性別友善廁所（兼顧無障礙與多元性別需求）",
            "男化妝室、女化妝室清潔明亮",
            "茶水間提供飲水機，歡迎民眾自備環保杯取用"
          ],
          tip: "本所 1 樓至 3 樓電梯旁皆設有性別友善廁所、男女化妝室與茶水間。",
          script: {
            zhuzhu:
              "電梯的右側就是茶水間、性別友善廁所以及男女化妝室。如果洽公口渴了，茶水間備有飲水機可以裝水；另外性別友善廁所也提供寬敞的無障礙空間，非常貼心喔！",
            yuanyuan:
              "一樓電梯東側集中配置了茶水間、性別友善廁所與男女化妝室，動線平坦無障礙，方便所有洽公民眾使用。"
          }
        }
      ]
    },

    "2f": {
      id: "2f",
      shortLabel: "2F",
      title: "二樓｜地價與行政辦公",
      englishTitle: "2nd Floor — Land Valuation & Administration",
      summary:
        "二樓主要為地價課、行政課、檔案閱覽處、人事室與會計室，左側設有公文檔案室、圖書室與地價倉庫，內側則為會議室、秘書室與主任室。",
      image: "assets/images/floor-2f.jpg",
      overviewScript: {
        zhuzhu:
          "歡迎來到二樓！我是竹竹。走出二樓電梯或樓梯後，右側一樣有茶水間、性別友善廁所與男女化妝室。正前方就是檔案閱覽處、會計室、人事室、地價課與行政課；左側依序是公文檔案室、圖書室與地價倉庫；最裡面則是會議室、秘書室與主任室喔！",
        yuanyuan:
          "現在來到二樓空間，由圓圓為您介紹。從梯廳進入二樓後，右側配置電梯、茶水間及各類化妝室。正前方辦公區由近而遠為檔案閱覽處、會計室、人事室、地價課與行政課；左側為公文檔案室、圖書室及地價倉庫；最上方則是會議室、秘書室與主任室。需要查實價登錄或調閱檔案，來二樓就對了！"
      },
      highlights: ["地價課", "行政課", "檔案閱覽處", "會議室", "主任室"],
      spots: [
        {
          id: "2f-landvalue",
          name: "地價課",
          englishName: "Land Value Section",
          category: "office",
          categoryLabel: "業務課室",
          x: 38.8,
          y: 38.5,
          locationHint: "二樓中央辦公區（行政課與檔案閱覽處之間）",
          services: [
            "不動產成交案件實際資訊申報登錄（實價登錄）查核與諮詢",
            "公告土地現值、公告地價查估、評議與地價動態調查",
            "申報地價、地價異動釐正及地價證明核發相關業務",
            "非都市土地編定與地價區段查詢服務"
          ],
          tip: "對實價登錄申報規定、公告土地現值或地價變動有疑問，皆可至二樓地價課洽詢。",
          script: {
            zhuzhu:
              "這裡是二樓中央的地價課！舉凡大家常聽到的實價登錄查核與諮詢、每年調整的公告土地現值與公告地價查估，以及地價相關查詢，都是由地價課專業團隊負責的喔！",
            yuanyuan:
              "地價課負責轄區內公告土地現值與公告地價的查估作業，同時辦理不動產實價登錄申報查核與地價資料維護，是掌握土地行情資訊的重要課室。"
          }
        },
        {
          id: "2f-admin",
          name: "行政課",
          englishName: "General Affairs Section",
          category: "office",
          categoryLabel: "業務課室",
          x: 38.8,
          y: 30.8,
          locationHint: "二樓中央辦公區北側（地價課前方）",
          services: [
            "公文總收發、檔案管理與研考為民服務規劃",
            "機關庶務、財產管理、廳舍維護與採購業務",
            "地政志工聯繫、民眾陳情與政令宣導協調"
          ],
          tip: "若要遞送公文或洽談機關庶務、場地與為民服務建議，可聯繫行政課。",
          script: {
            zhuzhu:
              "地價課往前走就是行政課囉！行政課就像事務所的大管家，負責公文收發、檔案管理、廳舍環境維護與各項為民服務推動，讓整個機關運作順暢又有溫度！",
            yuanyuan:
              "行政課位在地價課北側，掌理機關總收發、文書檔案管理、採購庶務、廳舍設施維護與為民服務研考，是支撐本所日常運作的核心單位。"
          }
        },
        {
          id: "2f-archives-reading",
          name: "檔案閱覽處",
          englishName: "Archives Reading Area",
          category: "service",
          categoryLabel: "洽公服務",
          x: 36.8,
          y: 52.5,
          locationHint: "二樓梯廳門進入正前方位置",
          services: [
            "受理民眾依檔案法申請閱覽、抄錄或複製機關檔案",
            "提供專人引導與專屬檔案閱覽座位區",
            "協助民眾核對閱覽申請核准通知書與辦理影印計費"
          ],
          tip: "申請檔案應用可先透過線上或書面申請，待審核通知後憑身分證件至二樓檔案閱覽處閱覽。",
          script: {
            zhuzhu:
              "走進二樓大門正前方就是檔案閱覽處！如果民眾需要申請閱覽、抄錄或複製地政相關歷史公文檔案，可以在這裡享有安靜舒適的閱覽空間與專人服務喔！",
            yuanyuan:
              "檔案閱覽處就在二樓入口正前方，提供民眾依法申請調閱、抄錄與複製檔案的專屬空間，並由專責人員協助辦理相關手續。"
          }
        },
        {
          id: "2f-accounting",
          name: "會計室",
          englishName: "Accounting Office",
          category: "office",
          categoryLabel: "幕僚單位",
          x: 47.8,
          y: 52.2,
          locationHint: "二樓入口進入後右側區域（檔案閱覽處旁）",
          services: [
            "機關年度預算編製、執行與決算審核",
            "規費收入帳務稽核與經費核銷作業",
            "辦理政府會計統計與財務透明公開事宜"
          ],
          tip: "廠商辦理經費請款或查詢退費核銷進度，可洽詢二樓會計室。",
          script: {
            zhuzhu:
              "在檔案閱覽處右手邊的是會計室，負責機關預算、決算、經費核銷以及地政規費帳務稽核，把每一分公帑都看管得清清楚楚！",
            yuanyuan:
              "會計室位於二樓入口右側，掌理歲計、會計與統計業務，負責機關經費審核與財務帳務管理。"
          }
        },
        {
          id: "2f-personnel",
          name: "人事室",
          englishName: "Personnel Office",
          category: "office",
          categoryLabel: "幕僚單位",
          x: 48.0,
          y: 45.5,
          locationHint: "二樓會計室北側、地價課右前方",
          services: [
            "機關同仁任免遷調、考績獎懲與差勤管理",
            "員工教育訓練、福利照護與性別平等業務推動",
            "協助機關人才招募與人事法規諮詢"
          ],
          tip: "如需洽詢人事公開甄選或實習相關事宜，可聯繫二樓人事室。",
          script: {
            zhuzhu:
              "會計室往裡面走一點就是人事室囉！人事室負責照顧事務所同仁的任用、教育訓練與各項福利，也是提升大家專業服務力量的重要後盾！",
            yuanyuan:
              "人事室位於會計室北側，負責人員任免、在職訓練、差勤考績與員工福利等人事行政業務。"
          }
        },
        {
          id: "2f-archives-room",
          name: "公文檔案室",
          englishName: "Archives Room",
          category: "office",
          categoryLabel: "機關庫房",
          x: 14.0,
          y: 58.0,
          locationHint: "二樓左側最南端（靠近檔案閱覽處左側）",
          services: [
            "依規定分類保存機關公文與永久、定期檔案",
            "配備溫濕度控管與消防安全設施確保檔案完整",
            "屬管制庫房，由檔案管理人員統一調卷"
          ],
          tip: "民眾如需調閱檔案，請至旁邊的「檔案閱覽處」由人員協助處理，請勿自行進入庫房。",
          script: {
            zhuzhu:
              "二樓左下方是公文檔案室，裡面整齊存放著機關的各項公文與歷史檔案。平時採安全管制，有需要查詢時會由專人從這裡調卷到檔案閱覽處給您看喔！",
            yuanyuan:
              "公文檔案室位在二樓左側，為標準檔案典藏空間，負責保存各類行政公文與重要檔案，並鄰近檔案閱覽處以利調卷作業。"
          }
        },
        {
          id: "2f-library",
          name: "圖書室",
          englishName: "Library",
          category: "office",
          categoryLabel: "內部空間",
          x: 13.5,
          y: 46.2,
          locationHint: "二樓左側中央（公文檔案室與地價倉庫之間）",
          services: [
            "收藏地政法規彙編、不動產專書與專業期刊",
            "提供同仁查閱法令解釋與進修研讀空間"
          ],
          tip: "圖書室主要存放地政專業法規書籍，支援各課室精準解答民眾法令問題。",
          script: {
            zhuzhu:
              "公文檔案室旁邊就是圖書室，裡面收集了許多地政法規與專業書籍，讓事務所的同仁能隨時充實專業知識，為大家提供最正確的服務！",
            yuanyuan:
              "圖書室位於二樓西側中段，典藏地政相關法令工具書與專業期刊，提供同仁研究法令與進修查閱。"
          }
        },
        {
          id: "2f-valuation-storage",
          name: "地價倉庫",
          englishName: "Land Valuation Storage",
          category: "office",
          categoryLabel: "機關庫房",
          x: 13.5,
          y: 34.2,
          locationHint: "二樓左側北段（圖書室上方）",
          services: [
            "存放歷年公告地價、公告現值查估表冊與地價區段圖",
            "供地價課查證歷史地價資料使用之管制庫房"
          ],
          tip: "歷史地價資料查詢可洽詢對面的二樓地價課窗口。",
          script: {
            zhuzhu:
              "再往前走是地價倉庫，裡面保存了歷年地價區段圖與查估資料，方便對面的地價課快速核對歷史地價喔！",
            yuanyuan:
              "地價倉庫位在二樓左側北段，專門存放歷年地價調查表冊與區段圖資，供地價課調閱使用。"
          }
        },
        {
          id: "2f-conference",
          name: "會議室",
          englishName: "Conference Room",
          category: "office",
          categoryLabel: "會議空間",
          x: 13.5,
          y: 11.2,
          locationHint: "二樓左上角（北側最左側）",
          services: [
            "召開機關業務會議、跨機關協調會與法規研討",
            "舉辦不動產調處協商或小型教育訓練活動"
          ],
          tip: "若受邀前來參與會議或協商，可由二樓梯廳直行到底再左轉即可抵達。",
          script: {
            zhuzhu:
              "二樓最內側左手邊是會議室，平常用來召開業務會議、地政協調會以及各式研討活動喔！",
            yuanyuan:
              "會議室位於二樓西北角，空間寬敞方正，主要用於機關內部會議、跨單位聯繫及業務研討。"
          }
        },
        {
          id: "2f-secretariat",
          name: "秘書室",
          englishName: "Secretariat",
          category: "office",
          categoryLabel: "主管辦公",
          x: 26.6,
          y: 11.2,
          locationHint: "二樓最內側（會議室與主任室之間）",
          services: [
            "綜理機關公文核稿、跨課室業務協調與幕僚作業",
            "協助主任推動各項創新便民措施與對外聯繫"
          ],
          tip: "位於會議室與主任室之間，負責各課室橫向聯繫協調。",
          script: {
            zhuzhu:
              "會議室旁邊是秘書室，秘書室協助綜理核稿並串聯各課室的合作，讓為民服務更加順暢有效率！",
            yuanyuan:
              "秘書室位在會議室與主任室之間，負責公文核稿、政策幕僚與跨課室業務協調工作。"
          }
        },
        {
          id: "2f-director",
          name: "主任室",
          englishName: "Director's Office",
          category: "office",
          categoryLabel: "主管辦公",
          x: 35.5,
          y: 11.2,
          locationHint: "二樓最內側（秘書室右側）",
          services: [
            "綜理桃園市蘆竹地政事務所全般所務與政策督導",
            "接待外賓參訪與推動在地友善地政服務"
          ],
          tip: "機關首長辦公處所，鄰近秘書室與後方樓梯間。",
          script: {
            zhuzhu:
              "秘書室右側就是主任室，由主任帶領整個蘆竹地政團隊，持續為蘆竹區與大園區的鄉親提供專業又暖心的地政服務！",
            yuanyuan:
              "主任室位於二樓北側，為本所首長辦公空間，負責統籌所務方針並督導各項地政為民服務品質。"
          }
        },
        {
          id: "2f-restroom",
          name: "電梯・性別友善廁所・茶水間",
          englishName: "Elevator, Restrooms & Tea Room",
          category: "facility",
          categoryLabel: "便民設施",
          x: 44.2,
          y: 70.0,
          locationHint: "二樓梯廳右側區域（後方北側亦設有男女化妝室）",
          services: [
            "電梯與樓梯往返一樓登記大廳與三樓測量課",
            "茶水間飲水設備、性別友善廁所及男女化妝室",
            "設有緊急逃生指引與消防栓箱"
          ],
          tip: "茶水間就在出電梯右手邊，男女化妝室與性別友善廁所緊鄰其旁。",
          script: {
            zhuzhu:
              "二樓電梯與樓梯旁邊同樣配有茶水間、性別友善廁所以及男女化妝室，動線和一樓一樣好找喔！",
            yuanyuan:
              "二樓右側梯廳集中配置了電梯、茶水間、性別友善廁所與男女化妝室，搭乘電梯往上即可到達三樓測量課與資訊課。"
          }
        }
      ]
    },

    "3f": {
      id: "3f",
      shortLabel: "3F",
      title: "三樓｜測量與資訊空間",
      englishTitle: "3rd Floor — Land Survey & Information Management",
      summary:
        "三樓以土地與建物測量業務及資訊系統維護為主，包含測量課、補正櫃台、民眾等候區、資訊課、電腦機房、電腦教室、地籍圖庫、登記倉庫、會議室與文康中心。",
      image: "assets/images/floor-3f.jpg",
      overviewScript: {
        zhuzhu:
          "歡迎來到三樓！我是竹竹。走出三樓電梯後，右側有茶水間、性別友善廁所與化妝室；正前方是民眾等候區、補正櫃台與登記倉庫，左側寬敞區域是測量課，右側為資訊課與電腦機房；最裡面還有地籍圖庫、會議室、電腦教室和文康中心喔！",
        yuanyuan:
          "歡迎來到我圓圓最拿手的三樓測量與資訊樓層！從三樓電梯出來，左手邊就是民眾等候區、補正櫃台與測量課，辦理土地鑑界、分割或建物測量都在這裡；右手邊是資訊課、電腦機房與電腦教室；後方則設有地籍圖庫、會議室與文康中心。右側同樣備有茶水間與各類化妝室。"
      },
      highlights: ["測量課", "補正櫃台", "資訊課", "地籍圖庫", "電腦教室"],
      spots: [
        {
          id: "3f-survey",
          name: "測量課",
          englishName: "Land Survey Section",
          category: "office",
          categoryLabel: "業務課室",
          x: 23.5,
          y: 47.5,
          locationHint: "三樓入口進入後左前方大片辦公區",
          services: [
            "土地複丈業務：土地鑑界、分割、合併、界址調整與未登記土地測量",
            "建物測量業務：建物第一次測量、分割、合併、增建與滅失勘查",
            "地籍圖重測協助、圖籍釐正與測量成果圖核校",
            "法院囑託測量及土地界址疑義諮詢"
          ],
          tip: "申請土地鑑界或分割案件後，若需與測量人員確認現場會勘時間或測量成果，可至三樓測量課洽詢。",
          script: {
            zhuzhu:
              "這裡是三樓最核心的測量課！不管是確認土地界線的『土地鑑界』、土地分割合併，還是新建物的『建物第一次測量』，都由測量課的專業測量員使用精密儀器為大家把關界址喔！",
            yuanyuan:
              "這裡就是我圓圓最熟悉的測量課！專責辦理土地鑑界、分割合併、建物第一次測量與地籍圖管理。對土地界線、測量會勘日期或測量成果有疑問，歡迎到這裡找測量課承辦人員！"
          }
        },
        {
          id: "3f-supplement",
          name: "補正櫃台",
          englishName: "Supplement Counter",
          category: "service",
          categoryLabel: "洽公服務",
          x: 32.8,
          y: 58.2,
          locationHint: "三樓民眾等候區南側、緊鄰測量課入口處",
          services: [
            "受理測量案件補正文件繳交與現場說明",
            "核對測量案件缺漏資料並協助確認補正事項",
            "領取測量相關通知或確認會勘排程"
          ],
          tip: "若您收到測量案件補正通知書，請攜帶通知書與應補文件直接到三樓補正櫃台辦理。",
          script: {
            zhuzhu:
              "在測量課入口旁邊設有專屬的補正櫃台。如果您的測量案件收到補正通知，只要帶著相關文件來到三樓補正櫃台，就能快速完成補件手續喔！",
            yuanyuan:
              "補正櫃台位於三樓民眾等候區旁，專門協助民眾辦理測量案件的文件補正與內容核對，讓案件能儘速完成排測與審查。"
          }
        },
        {
          id: "3f-waiting",
          name: "民眾等候區",
          englishName: "Waiting Area",
          category: "facility",
          categoryLabel: "便民設施",
          x: 37.8,
          y: 48.2,
          locationHint: "三樓大門進入正前方、測量課與登記倉庫之間",
          services: [
            "提供前來洽辦測量業務與補正之民眾舒適候位",
            "鄰近補正櫃台與測量課協談空間，方便等候承辦人員接待"
          ],
          tip: "上到三樓後可先在等候區稍坐，補正櫃台與測量課就在左手邊。",
          script: {
            zhuzhu:
              "從三樓梯廳走進來正前方就是民眾等候區，緊鄰補正櫃台與測量課，方便前來洽詢測量或辦理補件的朋友安心等候喔！",
            yuanyuan:
              "三樓民眾等候區位處梯廳與測量課交界處，動線清楚開闊，方便民眾在此整理文件或等候承辦人員協談。"
          }
        },
        {
          id: "3f-info",
          name: "資訊課",
          englishName: "Information Management Section",
          category: "office",
          categoryLabel: "業務課室",
          x: 54.0,
          y: 40.0,
          locationHint: "三樓入口右側區域（電腦機房北側、電腦教室南側）",
          services: [
            "地政整合資訊系統維運、網路資安防護與資料庫備份",
            "數位地政便民服務開發、網站維護與線上申辦系統管理",
            "地籍圖資數值化維護與空間資訊系統支援"
          ],
          tip: "本所數位櫃檯、網站服務與資安防護皆由資訊課團隊在幕後維護。",
          script: {
            zhuzhu:
              "三樓右手邊是資訊課！平常讓大家查資料超順暢的地政系統、線上便民網站，以及守護個人資料不外洩的資訊安全防護，全都是資訊課的功勞喔！",
            yuanyuan:
              "資訊課位於三樓右側，負責維護本所地政資料庫、資訊系統、網路資安與數位便民服務平台，是推動智慧地政的重要推手。"
          }
        },
        {
          id: "3f-server",
          name: "電腦機房",
          englishName: "Computer Facilities",
          category: "office",
          categoryLabel: "管制設施",
          x: 54.8,
          y: 54.5,
          locationHint: "三樓電梯北側、資訊課下方",
          services: [
            "建置地政核心伺服器、網路交換設備與不斷電系統",
            "全年無休維持地政資料庫與跨機關連線穩定運作",
            "屬高度門禁管制區域，僅限授權資訊人員進出"
          ],
          tip: "核心資安與伺服器重地，設有嚴格門禁與環控保護。",
          script: {
            zhuzhu:
              "資訊課旁邊是電腦機房，裡面放置了維持整個事務所連線與資料庫運作的重要伺服器，屬於高規格的門禁管制區喔！",
            yuanyuan:
              "電腦機房設於三樓東側，配置核心伺服器與資安備援設備，確保全所地政系統與地籍資料安全穩定不中斷。"
          }
        },
        {
          id: "3f-classroom",
          name: "電腦教室",
          englishName: "Computer Classroom",
          category: "office",
          categoryLabel: "訓練空間",
          x: 57.2,
          y: 26.5,
          locationHint: "三樓東北部（資訊課上方）",
          services: [
            "辦理地政系統操作訓練、資安宣導與數位技能研習",
            "提供同仁上機測驗與新進人員資訊課程培訓"
          ],
          tip: "位於資訊課北側，為機關數位教育訓練場地。",
          script: {
            zhuzhu:
              "資訊課往裡面走就是電腦教室，平時用來舉辦系統操作教學與資安研習，讓每位同仁都能熟練運用最新科技來服務民眾！",
            yuanyuan:
              "電腦教室位於三樓東北側，配備完整電腦教學設備，供本所辦理地政資訊系統培訓與數位研習使用。"
          }
        },
        {
          id: "3f-map-storage",
          name: "地籍圖庫",
          englishName: "Cadaster Map Storage",
          category: "office",
          categoryLabel: "機關庫房",
          x: 16.5,
          y: 16.5,
          locationHint: "三樓左上角（測量課正後方）",
          services: [
            "保存蘆竹區與大園區歷年紙本地籍原圖、副圖及測量原圖",
            "提供測量課進行歷史圖籍比對與界址疑義查證",
            "屬管制庫房，妥善防護珍貴歷史地籍圖資"
          ],
          tip: "如需申請地籍圖謄本，可直接在一樓全功能櫃檯隨到隨辦！",
          script: {
            zhuzhu:
              "測量課最裡面左手邊是地籍圖庫，裡面珍藏著歷年來的地籍圖與測量原圖，是測量人員查證土地界址的寶庫喔！如果想申請地籍圖謄本，直接到一樓全功能櫃檯就可以領取囉。",
            yuanyuan:
              "地籍圖庫位在三樓西北角，專門典藏轄區內珍貴的地籍原圖與測量圖資，協助測量課辦理界址考證與圖籍釐正作業。"
          }
        },
        {
          id: "3f-reg-storage",
          name: "登記倉庫",
          englishName: "Land Registration Storage",
          category: "office",
          categoryLabel: "機關庫房",
          x: 43.8,
          y: 51.0,
          locationHint: "三樓民眾等候區右側、電腦機房左側",
          services: [
            "存放歷年土地登記相關歸檔卷宗與憑證資料",
            "屬機關內部檔案儲存空間，採安全門禁管理"
          ],
          tip: "此為內部檔案庫房，相關案件查詢請洽一樓登記課。",
          script: {
            zhuzhu:
              "在三樓民眾等候區和電腦機房之間的是登記倉庫，專門用來妥善歸檔保存歷史登記卷宗，非開放民眾進入區域喔！",
            yuanyuan:
              "登記倉庫位於三樓中段，為機關內部歸檔庫房，負責長期保管歷年登記卷宗資料。"
          }
        },
        {
          id: "3f-conference",
          name: "會議室",
          englishName: "Conference Room",
          category: "office",
          categoryLabel: "會議空間",
          x: 35.5,
          y: 16.5,
          locationHint: "三樓最北側中段（地籍圖庫與文康中心之間）",
          services: [
            "舉辦大型地政法令宣導講座、地政士座談會與業務會議",
            "召開測量技術研討與跨機關協調會議"
          ],
          tip: "受邀參與三樓講習或座談會時，出電梯直行穿過等候區即可抵達。",
          script: {
            zhuzhu:
              "三樓北側中間設有大型會議室，常常用來舉辦地政法令講習、地政士交流座談和重要業務會議喔！",
            yuanyuan:
              "三樓會議室位於地籍圖庫與文康中心之間，空間寬廣，適合辦理較大規模的法令宣導、座談與業務會議。"
          }
        },
        {
          id: "3f-recreation",
          name: "文康中心",
          englishName: "Entertainment Room",
          category: "office",
          categoryLabel: "員工空間",
          x: 49.5,
          y: 9.5,
          locationHint: "三樓最北側偏右（會議室右側）",
          services: [
            "提供機關同仁午休放鬆、文康聯誼與健康促進空間",
            "營造友善職場環境，讓同仁維持充沛服務活力"
          ],
          tip: "員工專屬休憩與文康活動空間，鄰近北側安全梯。",
          script: {
            zhuzhu:
              "會議室再往右邊是文康中心，提供辛勤服務的同仁在休息時間放鬆身心、充電再出發喔！",
            yuanyuan:
              "文康中心位在三樓最上方偏右側，是本所同仁午間休憩與辦理文康活動的友善空間。"
          }
        },
        {
          id: "3f-restroom",
          name: "電梯・性別友善廁所・茶水間",
          englishName: "Elevator, Restrooms & Tea Room",
          category: "facility",
          categoryLabel: "便民設施",
          x: 53.8,
          y: 68.5,
          locationHint: "三樓梯廳右側區域（北側亦設有男女化妝室與安全梯）",
          services: [
            "電梯與樓梯往返一樓與二樓",
            "茶水間飲水設備、性別友善廁所與男女化妝室",
            "三樓西側與北側另設有緊急逃生安全梯"
          ],
          tip: "三樓同樣設有性別友善廁所與飲水機，洽辦測量業務時可方便使用。",
          script: {
            zhuzhu:
              "三樓電梯旁一樣設有茶水間、性別友善廁所與男女化妝室！另外在平面圖左側與上方也都有緊急逃生樓梯標示，安全又貼心喔！",
            yuanyuan:
              "三樓右側梯廳配置電梯、茶水間、性別友善廁所及男女化妝室；同時三樓左右兩側皆規劃有緊急逃生方向與安全梯，維護大樓公共安全。"
          }
        }
      ]
    }
  }
};
