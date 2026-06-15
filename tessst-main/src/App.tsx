import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff,
  Volume2, 
  VolumeX, 
  Search, 
  Columns, 
  Award, 
  RefreshCw, 
  Info, 
  Check, 
  HelpCircle, 
  AlertCircle, 
  Fingerprint, 
  Binary, 
  Zap,
  Flame,
  Layout,
  Trophy,
  Users,
  Terminal,
  Cpu,
  Wifi,
  Radio,
  FileCode,
  CheckCircle,
  Copy
} from 'lucide-react';
import { ELEMENTS_DATA, TableElement, getElement } from './elementsData';
import { ChemResponse, IntentType } from './types';
import ElementModal from './components/ElementModal';
import AtomOrbitVisualizer from './components/AtomOrbitVisualizer';
import AudioSpectrumVisualizer from './components/AudioSpectrumVisualizer';

// Web Speech API interfaces
type SpeechRecognitionType = any;
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

// Detailed Bilingual Translations
const TRANSLATIONS = {
  vi: {
    systemReady: "MÁY PHYGITAL: HOẠT ĐỘNG • SẴN SÀNG",
    phygitalMode: "Chế độ Phygital",
    speakerOn: "Đọc Giọng Nói: Bật",
    speakerOff: "Đọc Giọng Nói: Tắt",
    title: "ChemStation AI",
    subtitle: "Gia sư Hóa học & Hệ thống Bảng Tuần Hoàn Phygital tương tác",
    scoreGuess: "Cấp độ",
    points: "Điểm",
    activeCard: "Thẻ hoạt động",
    notScanned: "Chưa quẹt",
    elementsInteractiveMap: "Bản đồ tương tác Bảng Tuần Hoàn Phygital",
    clickHintPhygital: "👉 Click vào các thẻ trong Bảng tuần hoàn tương tác để mô phỏng quét thẻ bài vật lý!",
    clickHintStandard: "👉 Nhấn để xem nhanh thông số cấu hình electron.",
    groupLabel: "Phân nhóm:",
    voiceCoreTitle: "GIA SƯ CHEMSTATION AI VOICE VIRTUAL CORE",
    statusMicActive: "🔴 MIC HOẠT ĐỘNG: Đang lắng nghe âm giọng của bạn...",
    statusProcessing: "⚙️ Đang xử lý câu hỏi qua mô hình Gemini AI...",
    statusWaiting: "CHỜ LỆNH GỌI THOẠI TRÊN MÁY TƯƠNG TÁC PHYGITAL",
    voiceAssistantHelp: "Bạn có thể nói hoặc quẹt thẻ nguyên tố lên bàn máy để hệ thống tự động nhận dạng.",
    defaultGreeting: "Chào mừng bạn đến với ChemStation AI! Mình là Trợ lý ảo kiêm Gia sư Hóa học siêu thông minh của bạn. Hãy bấm phím micro nói chuyện, gõ câu hỏi hoặc kéo thẻ bài nguyên tố quẹt vào máy để bắt đầu khám phá nhé!",
    assistantLabel: "Trợ lý ChemStation AI",
    iupacPracticeWord: "Từ IUPAC luyện phát âm",
    recordedSpeech: "Ghi nhận từ bạn đọc",
    matching: "Độ chuẩn",
    quizZoneTitle: "BÀN QUÉT ĐỆM CHUYÊN ĐỀ ĐỐ VUI",
    quizZoneWaiting: "TRẠNG THÁI: CHỜ QUẸT THẺ",
    quizZoneDesc: "Hãy đoán nguyên tố được nói trên và quẹt thẻ của nó (hoặc click vào ô của nó trong bảng tuần hoàn tương tác).",
    quizSuccess: "🎉 Tuyệt hảo! Bạn đã đoán và lướt hoàn hảo thẻ bài chính xác.",
    quizFailure: "❌ Chưa chính xác. Đọc gợi ý và thử nạp lại một thẻ nguyên tố khác.",
    buttonNewQuiz: "Nạp Câu Hỏi Mới",
    micTooltipOn: "Nhấn để dừng nhận dạng",
    micTooltipOff: "Bật micro gọi thoại trợ lý",
    inputPlaceholderMic: "Hãy nói vào mic...",
    inputPlaceholderText: "Hỏi về tính chất chất, so sánh hoặc gõ 'chơi game'...",
    sampleIntentsTitle: "Ý định mẫu nhanh:",
    sampleIntentConductive: "Kim loại dẫn điện?",
    sampleIntentCompare: "So sánh Oxygen & Sulfur",
    sampleIntentPronounce: "Luyện phát âm: \"Nitrogen\"",
    sampleIntentPlayQuiz: "Chơi đố vui",
    comparePanelTitle: "GIAO DIỆN CHIA ĐÔI MÀN HÌNH SO SÁNH (COMPARE)",
    resetCompare: "Đặt lại",
    elementNotFound: "Không tìm thấy nguyên tố",
    firstElement: "thứ nhất",
    secondElement: "thứ hai",
    mass: "Khối lượng",
    electronegativity: "Độ âm điện",
    phaseLabel: "Trạng thái",
    meltingPoint: "Nhiệt độ nóng",
    electronConfigLabel: "Electron",
    diagnosticCardTitle: "THÔNG SỐ THẺ PHYGITAL RÀ SOÁT",
    sensingMode: "MODE: SENSING",
    electronConfigHeader: "CẤU HÌNH ELECTRON",
    massLabel: "KHỐI LƯỢNG",
    notDefined: "Không xác định",
    densityLabel: "Tỷ trọng",
    meltingPointLabel: "Nhiệt độ nóng chảy",
    phaseNaturalState: "Trạng thái tự nhiên",
    summaryAppLabel: "Tóm tắt & Ứng dụng",
    tagReaderLabel: "Nội dung nạp từ: PHYGITAL TAG READER",
    emptyReaderTitle: "BÀN ĐỌC THẺ PHYGITAL ĐANG TRỐNG",
    emptyReaderDesc: "Hãy click chạm vào thẻ nguyên tố ở bảng tuần hoàn để nạp dữ liệu rà soát và kích hoạt máy quét.",
    recentScansLog: "Nhật ký quét thẻ bài vật lý vừa qua:",
    emptyScansLog: "Trống - Hãy quẹt thẻ bài để cập nhật nhật ký",
    footerText: "© 2026 ChemStation AI Phygital Table - Học Tập Tương Tác Kỷ Nguyên Mới",
    footerSubtext: "Tiêu chuẩn danh pháp hóa học IUPAC tiếng Anh • Giao thức JSON phản hồi robot logic tự động",
    activeNode: "Active Node: Sẵn Sàng",
    speechSynthesisStatus: "Speech synthesis: OK",
    quickCmdConductive: "Kim loại nào dẫn điện tốt nhất thế giới",
    quickCmdCompare: "Hãy so sánh độ âm điện và khối lượng của Oxy và Lưu huỳnh",
    quickCmdQuiz: "Cho mình chơi game đố vui sinh động về một nguyên tố ngẫu nhiên",
    pronounceCheckCmd: "Kiểm tra giùm cách phát âm của từ",
    langCode: "vi-VN"
  },
  en: {
    systemReady: "PHYGITAL MACHINE: ONLINE • SYSTEM READY",
    phygitalMode: "Phygital Mode",
    speakerOn: "Voice Reading: ON",
    speakerOff: "Voice Reading: OFF",
    title: "ChemStation AI",
    subtitle: "Interactive Chemistry Tutor & Phygital Periodic Table System",
    scoreGuess: "Level",
    points: "Points",
    activeCard: "Active Card",
    notScanned: "Not Scanned",
    elementsInteractiveMap: "Phygital Periodic Table Interactive Map",
    clickHintPhygital: "👉 Click cells in the Interactive Periodic Table to simulate scanning a physical card!",
    clickHintStandard: "👉 Click to quickly inspect electron configuration.",
    groupLabel: "Groups:",
    voiceCoreTitle: "CHEMSTATION AI VIRTUAL VOICE VIRTUAL CORE",
    statusMicActive: "🔴 MIC ACTIVE: Listening to your voice...",
    statusProcessing: "⚙️ Processing query via Gemini AI model...",
    statusWaiting: "AWAITING VOICE OR PHYGITAL SWIPE INTERACTION",
    voiceAssistantHelp: "You can talk or swipe any element card on the digital desk to begin automatic recognition.",
    defaultGreeting: "Welcome to ChemStation AI! I am your smart Virtual Assistant and Chemistry Tutor. Click the mic to speak, type your questions, or swipe an element card to begin discovering chemistry!",
    assistantLabel: "ChemStation AI Assistant",
    iupacPracticeWord: "IUPAC Practice Word",
    recordedSpeech: "Captured Speech",
    matching: "Accuracy",
    quizZoneTitle: "QUIZ SWIPE GAME INTERACTION",
    quizZoneWaiting: "STATUS: AWAITING CARD",
    quizZoneDesc: "Guess the described element and swipe its card (or click its cell in the interactive table).",
    quizSuccess: "🎉 Brilliant! You guessed and swiped the correct card.",
    quizFailure: "❌ Incorrect. Re-read the hint and try swiping another element card.",
    buttonNewQuiz: "Load New Quiz Riddle",
    micTooltipOn: "Click to stop listening",
    micTooltipOff: "Turn on voice command assistant",
    inputPlaceholderMic: "Listening speak now...",
    inputPlaceholderText: "Ask about properties, compare elements, or type 'quiz'...",
    sampleIntentsTitle: "Quick Intent Examples:",
    sampleIntentConductive: "Conductive metals?",
    sampleIntentCompare: "Compare O & S",
    sampleIntentPronounce: "Pronounce: \"Nitrogen\"",
    sampleIntentPlayQuiz: "Play Quiz Game",
    comparePanelTitle: "SPLIT COMPARISON PANEL (COMPARE)",
    resetCompare: "Reset",
    elementNotFound: "Element not found",
    firstElement: "first",
    secondElement: "second",
    mass: "Mass",
    electronegativity: "Electronegativity",
    phaseLabel: "Phase",
    meltingPoint: "Melt Point",
    electronConfigLabel: "Electron",
    diagnosticCardTitle: "PHYGITAL CARD DIAGNOSTICS",
    sensingMode: "MODE: SENSING",
    electronConfigHeader: "ELECTRON CONFIGURATION",
    massLabel: "ATOMIC MASS",
    notDefined: "Not Defined",
    densityLabel: "Density",
    meltingPointLabel: "Melting Point",
    phaseNaturalState: "Natural State",
    summaryAppLabel: "Summary & Applications",
    tagReaderLabel: "Data source: PHYGITAL TAG READER",
    emptyReaderTitle: "PHYGITAL CARD READER IS EMPTY",
    emptyReaderDesc: "Click any element in the interactive table to simulate scanning a physical card and starting scanning sensors.",
    recentScansLog: "Recent swiped physical cards history:",
    emptyScansLog: "Empty - Swipe cards to populate layout history",
    footerText: "© 2026 ChemStation AI Phygital Table - Interactive EdTech Core v4",
    footerSubtext: "Standard IUPAC Chemical Nomenclature • Expressive AI JSON Response Orchestration",
    activeNode: "Active Node: OK",
    speechSynthesisStatus: "Speech synthesis: OK",
    quickCmdConductive: "Which metal has the highest electrical conductivity on earth?",
    quickCmdCompare: "Please compare the electronegativity and atomic mass of Oxygen and Sulfur",
    quickCmdQuiz: "Give me an engaging interactive riddle about a random chemistry element",
    pronounceCheckCmd: "Verify my pronunciation of the word",
    langCode: "en-US"
  }
};

const DEFAULT_QUIZ_QUESTIONS = [
  { question: "Tôi là kim loại kiềm nhẹ nhất, dùng nhiều trong pin sạc xe điện.", answer: "Li", options: ["A. Sodium (Na)", "B. Lithium (Li)", "C. Potassium (K)", "D. Zinc (Zn)"] },
  { question: "Tôi có số hiệu nguyên tử Z=6, nền tảng của mọi sự sống hữu cơ và kim cương.", answer: "C", options: ["A. Nitrogen (N)", "B. Oxygen (O)", "C. Carbon (C)", "D. Silicon (Si)"] },
  { question: "Tôi chiếm 78% khí quyển Trái Đất, cực kỳ trơ ở nhiệt độ thường.", answer: "N", options: ["A. Nitrogen (N)", "B. Oxygen (O)", "C. Helium (He)", "D. Argon (Ar)"] }
];

export default function App() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const t = TRANSLATIONS[language];

  // Core navigation tabs
  const [activeTab, setActiveTab] = useState<'sandbox' | 'gamification' | 'pvp' | 'hardware'>('sandbox');

  // Application general State
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Loaded responses from Express backend
  const [currentResponse, setCurrentResponse] = useState<any>({
    intent: 'search_qa',
    elements_to_highlight: [],
    spoken_response: 'Chào mừng bạn đến với ChemStation AI! Mình là Trợ lý ảo kiêm Gia sư Hóa học siêu thông minh của bạn. Hãy bấm phím micro nói chuyện, gõ câu hỏi hoặc kéo thẻ bài nguyên tố quẹt vào máy để bắt đầu khám phá nhé!'
  });

  // App Configurations & local cached values
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [selectedElement, setSelectedElement] = useState<TableElement | null>(getElement('H') || null);
  const [phygitalMode, setPhygitalMode] = useState<boolean>(true);
  const [scannedHistory, setScannedHistory] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Live WebSocket Telemetry state
  const [wsConnected, setWsConnected] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);

  // Advanced Gamification state loaded/saved locally
  const [gameScore, setGameScore] = useState<number>(() => {
    const saved = localStorage.getItem('cs_game_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const saved = localStorage.getItem('cs_unlocked_badges');
    return saved ? JSON.parse(saved) : [];
  });

  // Streak Combo fire state
  const [comboCount, setComboCount] = useState(0);
  const [lastSuccessTime, setLastSuccessTime] = useState<number>(0);

  // Solo Quiz Game current configuration
  const [currentQuizTarget, setCurrentQuizTarget] = useState<string>('He');
  const [quizGuessedSuccess, setQuizGuessedSuccess] = useState<boolean | null>(null);

  // Voice AI pronunciation trainer caching bounds
  const [pronounceTarget, setPronounceTarget] = useState<string>('Oxygen');
  const [pronounceScore, setPronounceScore] = useState<number | null>(null);
  const [recordedPronounceText, setRecordedPronounceText] = useState<string>('');

  // Dual PvP Chemistry Arena mode configuration
  const [pvpQuizIdx, setPvpQuizIdx] = useState(0);
  const [pvpRedScore, setPvpRedScore] = useState(0);
  const [pvpBlueScore, setPvpBlueScore] = useState(0);
  const [pvpFeedback, setPvpFeedback] = useState<string>('');

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Double storage persistence hooks
  useEffect(() => {
    localStorage.setItem('cs_game_score', gameScore.toString());
  }, [gameScore]);

  useEffect(() => {
    localStorage.setItem('cs_unlocked_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  const awardBadge = (badgeKey: string, alertText: string) => {
    if (!unlockedBadges.includes(badgeKey)) {
      setUnlockedBadges(prev => [...prev, badgeKey]);
      playSynthesizedTone('success');
      // Toast notification within client log
      appendClientLog('SUCCESS', 'BADGE_UNLOCKED', alertText);
    }
  };

  // Level computation: Level equals score increments of 30, plus 1
  const levelValue = Math.floor(gameScore / 30) + 1;
  const xpProgress = (gameScore * 10) % 100;

  // Insert client side logging dynamically
  const appendClientLog = (level: string, label: string, details: string) => {
    const freshLog = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      label,
      details
    };
    setTelemetryLogs(prev => [freshLog, ...prev].slice(0, 40));
  };

  // Tone generation subsystem using HTML5 AudioContext
  const playSynthesizedTone = (type: 'beep' | 'success' | 'failure' | 'scan') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (ctx.state === 'suspended') {
         ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'beep') {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'scan') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.23);
      } else if (type === 'success') {
        // High ascending chord
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc1.frequency.setValueAtTime(523, ctx.currentTime); // C5
        gain1.gain.setValueAtTime(0.04, ctx.currentTime);
        osc1.start(); osc1.stop(ctx.currentTime + 0.12);

        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2); gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(659, ctx.currentTime); // E5
          gain2.gain.setValueAtTime(0.04, ctx.currentTime);
          osc2.start(); osc2.stop(ctx.currentTime + 0.25);
        }, 110);
      } else if (type === 'failure') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.46);
      }
    } catch {}
  };

  // Setup WebSocket Listener (Live Hardware Node stream matching Port 3000)
  useEffect(() => {
    // Attempt parsing local Express DB telemetry log initially
    fetch('/api/telemetry/logs')
      .then(res => res.json())
      .then(data => {
        if (data.logs) {
          setTelemetryLogs(data.logs);
        }
      })
      .catch(() => {
        appendClientLog('WARN', 'NODE_OFF', 'Express local DB offline. Seeding memory console stack.');
      });

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    let socket: WebSocket;

    const connectToWebsockets = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          setWsConnected(true);
          appendClientLog('SUCCESS', 'WEBSOCKET', 'Futuristic telemetry link opened dynamically with port 3000 node.');
          // Handshake register
          socket.send(JSON.stringify({ type: 'register', clientType: 'browser' }));
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'handshake_ok') {
              if (data.recent_logs) setTelemetryLogs(data.recent_logs);
            } else if (data.type === 'physical_swipe') {
              // Real physical swipe hooked directly over WebSockets!
              handleIncomingSwipeEvent(data.symbol, data.uid || '0xESP32_RFID');
            } else if (data.type === 'esp32_command') {
              appendClientLog('INFO', 'LED_MATRIX_CUE', `Transmitted RGB flash cue down to WS strip clients: highlight [${data.elements_to_highlight.join(', ')}]`);
            }
          } catch (e) {
            console.warn('[WebSockets] Custom parse err:', e);
          }
        };

        socket.onclose = () => {
          setWsConnected(false);
          // Auto reconnect loop
          setTimeout(connectToWebsockets, 4000);
        };

        socket.onerror = () => {
          setWsConnected(false);
        };
      } catch {
        setWsConnected(false);
      }
    };

    connectToWebsockets();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Shared event handler for swiping (whether through UI simulation click or real physical ESP32 card)
  const handleIncomingSwipeEvent = (symbol: string, uid: string) => {
    const el = getElement(symbol);
    if (!el) return;

    playSynthesizedTone('scan');
    setSelectedElement(el);
    setScannedHistory(prev => {
      const filtered = prev.filter(s => s !== symbol);
      return [symbol, ...filtered].slice(0, 10);
    });

    appendClientLog('SUCCESS', 'TAG_SENSE', `Sensed Tag Symbol: [${symbol}] | Raw UID: [${uid}]`);

    // Verify gamification badge criteria
    if (el.category === 'halogen') {
      awardBadge('halogen_expert', 'Unlocked Badge: HALOGEN SPECIALIST! ⚡ (Inspected a halogen element)');
    }
    if (el.number >= 20) {
      awardBadge('heavy_atom', 'Unlocked Badge: BOHR MASTER! ⚛️ (Inspected a heavy Z>=20 element)');
    }

    // 1. Verify single-player quiz game answer
    if (currentResponse?.intent === 'game_quiz' && currentQuizTarget) {
      if (symbol.toLowerCase() === currentQuizTarget.toLowerCase()) {
        playSynthesizedTone('success');
        setQuizGuessedSuccess(true);
        
        // Multiplier Fire Combos calculations!
        const now = Date.now();
        let multiplier = 1;
        if (now - lastSuccessTime < 12000) {
          // Inside 12 seconds streak combo trigger
          setComboCount(prev => {
            const fresh = prev + 1;
            multiplier = fresh;
            appendClientLog('SUCCESS', 'COMBO_FIRE', `BURN STREAK! Combo multiplied x${fresh}! 🔥`);
            return fresh;
          });
          if (multiplier >= 3) {
            awardBadge('fire_lord', 'Unlocked Achievement: FIRE LORD! 🔥 (Maintained a combo streak >= 3)');
          }
        } else {
          setComboCount(1);
        }
        setLastSuccessTime(now);

        const scoreGained = 20 * multiplier;
        setGameScore(prev => {
          const freshScore = prev + scoreGained;
          if (freshScore >= 110) {
            awardBadge('grandmaster', 'Unlocked Badge: GRANDMASTER ALCHEMIST! 👑 (Exceeded 110 scorecard points)');
          }
          return freshScore;
        });

        const successSpeech = language === 'en'
          ? `Perfect! You guessed correctly by swiping ${el.name}. Adding ${scoreGained} points! Ready for next?`
          : `Tuyệt vời! Bạn đã trả lời đúng nguyên tố ${el.name}, tích lũy thêm ${scoreGained} điểm! Bạn đã sẵn sàng câu tiếp?`;
        
        speakTextLocal(successSpeech);
      } else {
        playSynthesizedTone('failure');
        setQuizGuessedSuccess(false);
        const failSpeech = language === 'en'
          ? `That was ${el.name} which is incorrect. Try scanning another element card.`
          : `Chưa chính xác, đây là nguyên tố ${el.name}. Hãy thử quẹt nạp một thẻ nguyên tố khác xem sao.`;
        speakTextLocal(failSpeech);
      }
    }

    // 2. Clear PvP Arena guess check
    handlePvPArenaScan(symbol);
  };

  // Simulate an incoming swipe triggered locally over REST
  const handleHardwareSwipeEmulator = (symbol: string) => {
    fetch('/api/telemetry/inject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol })
    })
    .then(res => res.json())
    .catch(() => {
      // Offline fallback: call locally immediately
      handleIncomingSwipeEvent(symbol, '0xSIMULATED_TAG');
    });
  };

  // Play pronunciation synthesized speech
  const speakTextLocal = (text: string) => {
    if (!ttsEnabled) return;
    const isEn = language === 'en';
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isEn ? 'en-US' : 'vi-VN';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS Speech Synthesis error:', e);
    }
  };

  // Submit semantic text questions into Express backend gateway
  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setInputText('');

    try {
      appendClientLog('INFO', 'GEMINI_REQ', `Transmitting AI prompt gateway: "${queryText}"`);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText, lang: language })
      });

      const data = await res.json();
      setCurrentResponse(data);

      // Speak out AI friendly spoken text
      if (data.spoken_response) {
        speakTextLocal(data.spoken_response);
      }

      // Sync active state attributes if AI returned certain intents
      if (data.intent === 'game_quiz' && data.target_element) {
        setCurrentQuizTarget(data.target_element);
        setQuizGuessedSuccess(null);
        awardBadge('novice_alchemist', 'Unlocked Badge: NOVICE ALCHEMIST! 🧪 (Started an interactive AI game)');
      } else if (data.intent === 'reaction_simulate' && data.reactants) {
        // Explode / Highlight reaction parts automatically!
        if (data.reactants.length > 0) {
          const matchedEl = getElement(data.reactants[0]);
          if (matchedEl) setSelectedElement(matchedEl);
        }
        if (data.hazard_rating === 'danger') {
          playSynthesizedTone('failure');
          appendClientLog('WARN', 'HAZARD_ALERT', `HIGH DANGER REACTION DETECTED: [${data.balanced_equation}]`);
          awardBadge('fire_lord', 'Unlocked Achievement: FIRE LORD! 🔥 (Triggered a danger rated reaction simulation)');
        }
      } else if (data.intent === 'pronunciation') {
        const targetWord = queryText.replaceAll(/Kiểm tra giùm cách phát âm của từ|Evaluate my pronunciation of word|Verify my pronunciation of|pronounce/gi, '').trim();
        if (targetWord) {
          setPronounceTarget(targetWord);
          setPronounceScore(data.score !== undefined ? data.score : 80);
        }
      }
    } catch (err) {
      console.error(err);
      appendClientLog('ERROR', 'SYSTEM', 'API packet exchange breakdown.');
    } finally {
      setLoading(false);
    }
  };

  // Handle preset clicks helper
  const handleQuickCommand = (preset: string) => {
    const isEn = language === 'en';
    if (preset === 'game') {
      handleSendQuery(isEn ? 'Give me an engaging interactive riddle about a random chemistry element' : 'Cho mình chơi game đố vui sinh động về một nguyên tố ngẫu nhiên');
    } else if (preset === 'compare_Preset') {
      handleSendQuery(isEn ? 'Please compare the electronegativity and atomic mass of Oxygen and Sulfur' : 'Hãy so sánh độ âm điện và khối lượng của Oxy và Lưu huỳnh');
    } else if (preset.startsWith('pronounce_')) {
      const elementWord = preset.replace('pronounce_', '');
      setPronounceTarget(elementWord);
      setPronounceScore(null);
      setRecordedPronounceText('');
      handleSendQuery(isEn ? `Verify my pronunciation of ${elementWord}` : `Kiểm tra giùm cách phát âm của từ ${elementWord}`);
    } else if (preset === 'reaction') {
      handleSendQuery(isEn ? 'What happens when Sodium is mixed with Water' : 'Cho Sodium tác dụng với Nước sinh ra chất gì');
    } if (preset === 'curriculum') {
      handleSendQuery(isEn ? 'Generate an academic chemistry test preparation question for me' : 'Hãy cho mình một câu hỏi ôn luyện thi bám sát chương trình đề thi');
    }
  };

  // Fallback trigger click for cards in the table (highly required for simulating phygital behavior)
  const handlePhysicalSwipe = (el: TableElement) => {
     handleIncomingSwipeEvent(el.symbol, '0xTABLE_CLICKED_' + el.number);
  };

  // STT Microphone recorder trigger
  const startSTTListening = () => {
    const isEn = language === 'en';
    if (!SpeechRecognition) {
      // Simulate speech recognized if block inside iframe
      setIsListening(true);
      playSynthesizedTone('beep');
      const simPrompt = isEn ? "Simulated vocal command: Describe carbon applications" : "Đố vui về nguyên tố hóa học Heli";
      
      setTimeout(() => {
        setIsListening(false);
        setInputText(simPrompt);
        handleSendQuery(simPrompt);
      }, 2000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = isEn ? 'en-US' : 'vi-VN';

    recognition.onstart = () => {
      setIsListening(true);
      playSynthesizedTone('beep');
    };

    recognition.onresult = (event: any) => {
      const textCollected = event.results[0][0].transcript;
      setInputText(textCollected);
      handleSendQuery(textCollected);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // PVP Arena Logic Subsystems
  const handlePvPArenaScan = (symbol: string) => {
    if (activeTab !== 'pvp') return;
    const currentQ = DEFAULT_QUIZ_QUESTIONS[pvpQuizIdx];
    if (symbol.toLowerCase() === currentQ.answer.toLowerCase()) {
      // Correct! But which player swiped it?
      // Since it's simulated, we check which player panel is currently active or focused
      setPvpFeedback(language === 'en'
         ? `🎉 Excellent! Correct element [${symbol}] swiped! Red Team locks (+15 pts)`
         : `🎉 Tuyệt vời! Bạn vừa quét nguyên tố [${symbol}] hoàn toàn chính xác! Đội ĐỎ ghi bài (+15 điểm)`
      );
      setPvpRedScore(prev => prev + 15);
      playSynthesizedTone('success');
      
      // Auto move next question after 4s
      setTimeout(() => {
        setPvpQuizIdx(prev => (prev + 1) % DEFAULT_QUIZ_QUESTIONS.length);
        setPvpFeedback('');
      }, 4000);
    } else {
      setPvpFeedback(language === 'en'
        ? `❌ Wrong card: ${symbol} is not the correct answer. Try representing another element.`
        : `❌ Ôi! Thẻ nguyên tố ${symbol} không khớp đáp án. Hãy quét nạp thẻ nguyên tố khác.`
      );
      playSynthesizedTone('failure');
    }
  };

  const handlePvPInjectWinner = (team: 'red' | 'blue', answerSymbol: string) => {
     handleIncomingSwipeEvent(answerSymbol, `0xPVP_INJECT_${team.toUpperCase()}`);
     if (team === 'red') {
       setPvpRedScore(prev => prev + 20);
       setPvpFeedback(language === 'en' ? `🔴 Red Team scanned correct answer: ${answerSymbol}! (+20 Pts)` : `🔴 Đội ĐỎ quẹt đúng thẻ: ${answerSymbol}! (+20 Điểm)`);
     } else {
       setPvpBlueScore(prev => prev + 20);
       setPvpFeedback(language === 'en' ? `🔵 Blue Team scanned correct answer: ${answerSymbol}! (+20 Pts)` : `🔵 Đội XANH quẹt đúng thẻ: ${answerSymbol}! (+20 Điểm)`);
     }
     playSynthesizedTone('success');
     setTimeout(() => {
        setPvpQuizIdx(prev => (prev + 1) % DEFAULT_QUIZ_QUESTIONS.length);
        setPvpFeedback('');
     }, 4000);
  };

  const getCategoryColor = (cat: string) => {
     switch (cat) {
      case 'alkali-metal': return 'bg-rose-500/15 border-rose-500 text-rose-300';
      case 'alkaline-earth': return 'bg-orange-500/15 border-orange-500 text-orange-300';
      case 'transition-metal': return 'bg-amber-500/15 border-amber-500 text-amber-300';
      case 'lanthanide': return 'bg-pink-500/15 border-pink-400 text-pink-300';
      case 'actinide': return 'bg-purple-500/15 border-purple-400 text-purple-300';
      case 'post-transition-metal': return 'bg-cyan-500/15 border-cyan-500 text-cyan-300';
      case 'metalloid': return 'bg-emerald-500/15 border-emerald-500 text-emerald-300';
      case 'reactive-nonmetal': return 'bg-sky-500/15 border-sky-400 text-sky-200';
      case 'halogen': return 'bg-teal-500/15 border-teal-500 text-teal-300';
      case 'noble-gas': return 'bg-violet-500/15 border-violet-500 text-violet-300';
      default: return 'bg-slate-700/10 border-slate-600 text-slate-300';
     }
  };

  const getCategoryLabel = (cat: string) => {
    const isEn = language === 'en';
    switch (cat) {
      case 'alkali-metal': return isEn ? 'Alkali metal' : 'Kim loại kiềm';
      case 'alkaline-earth': return isEn ? 'Alkaline earth' : 'Kim loại kiềm thổ';
      case 'transition-metal': return isEn ? 'Transition metal' : 'Kim loại chuyển tiếp';
      case 'lanthanide': return isEn ? 'Lanthanide' : 'Họ Lantan';
      case 'actinide': return isEn ? 'Actinide' : 'Họ Actini';
      case 'post-transition-metal': return isEn ? 'Post-transition metal' : 'Kim loại sau chuyển tiếp';
      case 'metalloid': return isEn ? 'Metalloid' : 'Á kim';
      case 'reactive-nonmetal': return isEn ? 'Reactive nonmetal' : 'Phi kim hoạt động';
      case 'halogen': return isEn ? 'Halogen' : 'Halogen';
      case 'noble-gas': return isEn ? 'Noble gas' : 'Khí hiếm';
      default: return isEn ? 'Other' : 'Khác';
    }
  };

  const renderGridMatrix = () => {
    const grid: (TableElement | null)[][] = Array(9).fill(null).map(() => Array(18).fill(null));
    ELEMENTS_DATA.forEach((el) => {
      grid[el.row - 1][el.col - 1] = el;
    });
    return grid;
  };

  const isHighlighted = (symbol: string) => {
    if (!currentResponse) return true;
    if (currentResponse.intent === 'search_qa' && currentResponse.elements_to_highlight) {
      if (currentResponse.elements_to_highlight.length === 0) return true;
      return currentResponse.elements_to_highlight.some((s: string) => s.toLowerCase() === symbol.toLowerCase());
    }
    if (currentResponse.intent === 'compare' && currentResponse.elements_to_compare) {
      return currentResponse.elements_to_compare.some((s: string) => s.toLowerCase() === symbol.toLowerCase());
    }
    if (currentResponse.intent === 'reaction_simulate') {
      const activeReactants = currentResponse.reactants || [];
      const activeProducts = currentResponse.products || [];
      if (activeReactants.length === 0) return true;
      return [...activeReactants, ...activeProducts].some((s: string) => s.toLowerCase() === symbol.toLowerCase());
    }
    return true;
  };

  // Sơ đồ mạch & sketch source code string for hardware builders
  const arduino_source = `/*
  ChemStation Phygital RFID WiFi Hook Client
  Hardware Requirements: ESP32 + MFRC522 + WS2812B Smart Matrix
*/
#include <WiFi.h>
#include <WebSocketsClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ArduinoJson.h>

const char* ssid = "WiFi_SSID_Here";
const char* password = "WiFi_PASSWORD_Here";
const char* server_host = "3000-port-link-here.run.app"; // Or localized host IP
const uint16_t server_port = 3000;

MFRC522 mfrc522(21, 22); // SS_PIN = 21, RST_PIN = 22
WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_TEXT) {
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    if (doc["type"] == "esp32_command") {
      // Light up LEDs corresponding to elements_to_highlight!
      Serial.println("Triggering real WS2812 LED indices!");
    }
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  SPI.begin();
  mfrc522.PCD_Init();
  webSocket.begin(server_host, server_port, "/ws");
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String tagUID = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
       tagUID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
       tagUID += String(mfrc522.uid.uidByte[i], HEX);
    }
    // Formulate real scanned payload: map raw UID to element Symbol
    DynamicJsonDocument doc(256);
    doc["type"] = "esp32_rfid_swipe";
    doc["symbol"] = "Na"; // In production, map specific tagUID variables
    doc["uid"] = tagUID;

    String jsonStr;
    serializeJson(doc, jsonStr);
    webSocket.sendTXT(jsonStr);
    mfrc522.PICC_HaltA();
  }
}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* Top Telemetry system header tracker */}
      <div className="bg-sky-500/10 border-b border-sky-500/20 px-4 py-2 text-xs flex justify-between items-center z-10 font-mono">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${wsConnected ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${wsConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
          <span className="text-slate-400 tracking-wide text-[10px]">
            {wsConnected ? `🟢 INTEGRATED CONNECTED (PHYGITAL WS LIVE)` : `🔴 OFFBAND LOG: EMULATING OFFLINE CONNECTIVITY`}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              playSynthesizedTone('beep');
              setLanguage(prev => (prev === 'vi' ? 'en' : 'vi'));
            }}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            id="language-switch-btn"
          >
            <span className="text-[10px] font-bold">🇬🇧 EN | 🇻🇳 VI:</span>
            <span className="text-[10px] font-black uppercase text-sky-400 ml-1">
              {language.toUpperCase()}
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setPhygitalMode(!phygitalMode)} 
            className={`flex items-center space-x-1.5 px-2 py-0.5 rounded transition ${
              phygitalMode 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`}
            id="phygital-mode-toggle"
          >
            <Fingerprint className="w-3 h-3" />
            <span className="text-[10px] font-medium">{t.phygitalMode} [{phygitalMode ? (language === 'vi' ? 'Bật' : 'ON') : (language === 'vi' ? 'Tắt' : 'OFF')}]</span>
          </button>

          <button 
            type="button"
            onClick={() => setTtsEnabled(!ttsEnabled)} 
            className="text-slate-400 hover:text-white transition flex items-center space-x-1"
            id="tts-toggle"
          >
            {ttsEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px]">{ttsEnabled ? t.speakerOn : t.speakerOff}</span>
          </button>
        </div>
      </div>

      {/* Main Branding Header Row */}
      <header className="px-6 py-4 bg-slate-900/60 backdrop-blur border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-lg text-white shadow-lg shadow-sky-500/20">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-indigo-100 to-emerald-300">
              {t.title}
            </h1>
            <p className="text-xs text-slate-400 tracking-wide font-medium">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Gamification Ribbon */}
        <div className="flex items-center space-x-3 self-end md:self-auto font-mono text-xs">
          
          {/* Level Progress Circular box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 rounded-full border-2 border-indigo-500/20 bg-slate-950 flex items-center justify-center font-bold text-indigo-400 text-sm">
                L{levelValue}
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider block">XP PROGRESS</span>
              <div className="w-16 h-1.5 bg-slate-950 rounded-full overflow-hidden mt-0.5 border border-slate-800">
                <div className="bg-indigo-400 h-full transition-all duration-500" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          </div>

          {/* Points display */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">{language === 'vi' ? 'ĐIỂM GIAO TIẾP' : 'SCORE CARD'}</span>
              <span className="font-bold text-slate-200">{gameScore} Pts</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <div>
              <span className="text-slate-400 block text-[9px] uppercase tracking-wider">{t.activeCard}</span>
              <span className="font-bold text-cyan-300">
                {selectedElement ? `${selectedElement.symbol} (${selectedElement.number})` : t.notScanned}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Tab Ribbons */}
      <nav className="px-6 py-2 bg-slate-900 border-b border-slate-850 flex items-center space-x-1 overflow-x-auto scroller-style font-mono">
        <button
          onClick={() => { playSynthesizedTone('beep'); setActiveTab('sandbox'); }}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
            activeTab === 'sandbox' 
              ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Học Tập Phygital Sandbox' : 'Sandbox Workspace'}</span>
        </button>

        <button
          onClick={() => { playSynthesizedTone('beep'); setActiveTab('gamification'); }}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
            activeTab === 'gamification' 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Thành Tựu & Cúp' : 'Achievements Hub'}</span>
        </button>

        <button
          onClick={() => { playSynthesizedTone('beep'); setActiveTab('pvp'); }}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
            activeTab === 'pvp' 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-450' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Đấu trường PvP Dual-Player' : 'PvP Chemistry Arena'}</span>
        </button>

        <button
          onClick={() => { playSynthesizedTone('beep'); setActiveTab('hardware'); }}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition ${
            activeTab === 'hardware' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{language === 'vi' ? 'Sơ đồ Phần cứng & Telemetry' : 'IoT Nodes Console'}</span>
        </button>
      </nav>

      {/* Main Interactive Matrix Board Container */}
      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full flex flex-col relative">

        {/* Combo flame fire indicators floating if high combo exists */}
        {comboCount >= 2 && (
          <div className="absolute top-1 right-6 bg-gradient-to-r from-orange-600 to-rose-600 border border-orange-400 text-white font-mono px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-lg animate-bounce z-20">
            <Flame className="w-4 h-4 text-amber-200 animate-pulse" />
            <span className="text-xs font-black tracking-widest uppercase">COMBO STREAK x{comboCount}! 🔥</span>
          </div>
        )}

        {/* Static Periodic Matrix Grid */}
        <section className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 shadow-inner flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 px-1.5 rounded bg-sky-500/10 text-sky-450 text-xs font-mono font-bold">118 Elements Map</span>
              <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-300 font-display">
                {t.elementsInteractiveMap}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400">
              {phygitalMode ? t.clickHintPhygital : t.clickHintStandard}
            </p>
          </div>

          <div className="overflow-x-auto scroller-style pb-3">
            <div className="min-w-[1024px] grid grid-cols-18 gap-1.5 font-mono">
              {renderGridMatrix().map((rowArray, rIdx) => {
                const isExtraRow = rIdx >= 7;
                return (
                  <React.Fragment key={`row-${rIdx}`}>
                    {isExtraRow && rIdx === 7 && (
                      <div className="col-span-18 h-3 select-none" />
                    )}
                    {rowArray.map((el, cIdx) => {
                      if (!el) {
                        return <div key={`empty-${rIdx}-${cIdx}`} className="aspect-square" />;
                      }

                      const highlighted = isHighlighted(el.symbol);
                      const isSelected = selectedElement?.symbol === el.symbol;
                      const categoryStyle = getCategoryColor(el.category);
                      
                      return (
                        <button
                          key={el.number}
                          type="button"
                          id={`element-${el.symbol}`}
                          onClick={() => {
                            setSelectedElement(el);
                            setIsModalOpen(true);
                            if (phygitalMode) {
                              handlePhysicalSwipe(el);
                            } else {
                              playSynthesizedTone('beep');
                            }
                          }}
                          className={`relative aspect-square rounded p-1 text-left border flex flex-col justify-between transition-all duration-300 group cursor-pointer ${categoryStyle} ${
                            highlighted 
                              ? 'opacity-100 scale-100 shadow-md translate-y-0' 
                              : 'opacity-15 scale-95 border-slate-900'
                          } ${
                            isSelected 
                              ? 'ring-2 ring-sky-400 shadow-[0_0_15px_rgba(58,191,248,0.5)] scale-102 z-10' 
                              : 'hover:scale-105 hover:z-10'
                          }`}
                        >
                          <span className="text-[9px] font-bold text-slate-400 leading-none">
                            {el.number}
                          </span>
                          
                          <div className="text-center font-bold text-[14px] leading-none tracking-tight font-display">
                            {el.symbol}
                          </div>
                          
                          <span className="text-[7.5px] leading-none text-slate-400 block truncate uppercase tracking-widest text-center">
                            {el.name}
                          </span>
                          
                          <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-current opacity-70 group-hover:scale-150 transition-transform" />
                        </button>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Quick legend element categories */}
          <div className="flex flex-wrap gap-2 text-[10px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-mono text-[9px] uppercase mr-2 flex items-center">{t.groupLabel}</span>
            {[
              { cat: 'reactive-nonmetal' },
              { cat: 'noble-gas' },
              { cat: 'alkali-metal' },
              { cat: 'alkaline-earth' },
              { cat: 'metalloid' },
              { cat: 'halogen' },
              { cat: 'post-transition-metal' },
              { cat: 'transition-metal' },
              { cat: 'lanthanide' },
              { cat: 'actinide' },
            ].map(item => (
              <div key={item.cat} className="flex items-center space-x-1.5 px-2 py-0.5 rounded border border-slate-800/40 bg-slate-900 text-slate-300">
                <span className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(item.cat).split(' ')[0]}`} />
                <span>{getCategoryLabel(item.cat)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TAB WORKSPACE ROUTER GRID */}
        
        {/* TAB 1: SANDBOX STUDY STATION */}
        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
            
            {/* LEFT COLUMN: Gemini Chatbot assistant console */}
            <section className="lg:col-span-7 flex flex-col bg-slate-900/50 rounded-xl border border-slate-800/70 shadow-lg overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-850 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-sky-300">
                    {t.voiceCoreTitle}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                  <span className="text-emerald-400 font-bold">INTENT: {currentResponse?.intent?.toUpperCase()}</span>
                </div>
              </div>

              {/* Speech spectrum spectroscope panel */}
              <div className="p-4 bg-slate-950/40 border-b border-slate-850 space-y-3">
                <AudioSpectrumVisualizer isListening={isListening} />
                <div className="text-center font-mono text-[10px] text-slate-500">
                  {isListening ? t.statusMicActive : t.statusWaiting}
                </div>
              </div>

              {/* Chat replies scrolling container */}
              <div className="p-4 flex-1 overflow-y-auto max-h-[300px] min-h-[160px] space-y-3 scroller-style bg-slate-950/20">
                
                {/* Visual Reaction Simulation Card Layer if reaction_simulate is active */}
                {currentResponse?.intent === 'reaction_simulate' && currentResponse.balanced_equation && (
                  <div className="p-4 bg-orange-950/45 border-2 border-orange-500/40 rounded-xl space-y-3 animate-pulse">
                    <div className="flex items-center justify-between border-b border-orange-500/20 pb-2">
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4.5 h-4.5 text-orange-400" />
                        <span className="text-xs font-mono font-bold text-orange-300 uppercase tracking-widest">
                          {language === 'vi' ? 'PHẢN ỨNG MÔ PHỎNG THỰC TẾ' : 'REACTION SYNTHESIZER SIMULATOR'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white ${
                        currentResponse.hazard_rating === 'danger' ? 'bg-red-600' : 'bg-orange-600'
                      }`}>
                        HAZARD: {currentResponse.hazard_rating?.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-center py-2.5 bg-slate-950/80 rounded-lg border border-orange-500/20">
                      <p className="text-xl font-bold font-mono tracking-widest text-orange-300">
                        {currentResponse.balanced_equation}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10.5px] font-mono text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500 block">REACTANTS (Chất tham gia):</span>
                        <span>{currentResponse.reactants?.join(' + ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">PRODUCTS (Chất sinh ra):</span>
                        <span>{currentResponse.products?.join(' + ')}</span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-2.5 rounded border border-orange-500/10">
                      <strong>{language === 'vi' ? 'Mô tả hiện tượng:' : 'Visual cues:'}</strong> {currentResponse.visual_description}
                    </p>
                  </div>
                )}

                {/* Academic Curriculum Test Prep Exam multiple choice selection */}
                {currentResponse?.intent === 'curriculum_prep' && currentResponse.quiz_question && (
                  <div className="p-4 bg-indigo-950/60 border border-indigo-500/30 rounded-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2 text-xs font-mono">
                      <span className="text-indigo-300 font-bold tracking-widest">LUYỆN ĐỀ CHƯƠNG TRÌNH THPT QUỐC GIA (IUPAC)</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">10 EXP</span>
                    </div>

                    <p className="text-sm font-semibold text-slate-100">
                      {currentResponse.quiz_question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                      {currentResponse.quiz_options?.map((option: string, idx: number) => {
                        const optLetter = option.trim().charAt(0);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (optLetter === currentResponse.quiz_answer) {
                                playSynthesizedTone('success');
                                setGameScore(p => p + 10);
                                appendClientLog('SUCCESS', 'CURRICULUM_EXAM', 'Correct multiple choice answer! (+10 pts)');
                                speakTextLocal(language === 'en' ? 'Excellent! That is the correct answer.' : 'Chính xác! Bạn chọn đáp án hoàn hảo.');
                              } else {
                                playSynthesizedTone('failure');
                                speakTextLocal(language === 'en' ? 'Incorrect answer. Read the explanation notes.' : 'Chưa đúng rồi. Hãy đọc phần phân tích lý thuyết.');
                              }
                            }}
                            className="p-2.5 text-left rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-slate-950/40 rounded-lg text-xs leading-relaxed text-slate-400 border border-indigo-500/5">
                      <strong className="text-indigo-400 block mb-1">Theoretical Notes (Phân tích lý thuyết):</strong>
                      <p>{currentResponse.academic_notes}</p>
                    </div>
                  </div>
                )}

                {/* Gemini spoken text response chatbubble */}
                <div className="rounded-lg bg-sky-950/20 p-4 border border-sky-900/30">
                  <span className="text-[9px] bg-sky-500/10 text-sky-400 font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm block w-fit mb-1">
                    {t.assistantLabel}
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans select-text">
                    {currentResponse?.spoken_response || t.defaultGreeting}
                  </p>
                </div>

                {/* Solo game quiz helper prompt details */}
                {currentResponse?.intent === 'game_quiz' && (
                  <div className="p-3 bg-indigo-900/20 border border-indigo-800/40 rounded-lg space-y-2 text-xs">
                    <p className="text-slate-300 font-medium font-mono uppercase tracking-widest text-[10px]">GAME MISSION ACTIVE:</p>
                    <p className="text-slate-300">Guess the correct element based on my above clue and either click its block on the map or swipe its card!</p>
                  </div>
                )}
              </div>

              {/* Bot controls inputs form */}
              <div className="p-4 bg-slate-900/95 border-t border-slate-800 space-y-4">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendQuery(inputText); }}
                  className="flex items-center space-x-2"
                  id="search-input-form"
                >
                  <button
                    type="button"
                    onClick={startSTTListening}
                    className={`p-3 rounded-lg transition-all border ${
                      isListening
                        ? 'bg-red-500 border-red-400 animate-pulse text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80'
                    }`}
                    title={isListening ? t.micTooltipOn : t.micTooltipOff}
                    id="mic-button"
                  >
                    {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5 text-sky-400" />}
                  </button>

                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? t.inputPlaceholderMic : t.inputPlaceholderText}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 text-sm py-2.5 pl-3 pr-10 rounded-lg outline-none transition text-slate-200"
                      disabled={loading}
                      id="search-input-field"
                    />
                    <button
                      type="submit"
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition"
                      disabled={loading || !inputText.trim()}
                      id="send-button"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                <div className="space-y-1.5 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">{t.sampleIntentsTitle}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => handleQuickCommand("Kim loại kiềm thổ thuộc nhóm mấy")} 
                      className="text-[10.5px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 rounded text-slate-300 transition"
                    >
                      🔍 Mẫu: Hỏi nhóm kim loại
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleQuickCommand('compare_Preset')} 
                      className="text-[10.5px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 rounded text-slate-300 transition"
                    >
                      ⚖️ {t.sampleIntentCompare}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleQuickCommand('reaction')} 
                      className="text-[10.5px] px-2.5 py-1 bg-amber-950/20 hover:bg-amber-900/30 rounded text-amber-200 border border-amber-900/30 transition"
                    >
                      💥 {language === 'vi' ? 'Mô phỏng Phản ứng' : 'Simulate Reaction'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleQuickCommand('curriculum')} 
                      className="text-[10.5px] px-2.5 py-1 bg-indigo-950/25 hover:bg-indigo-900/35 rounded text-indigo-300 border border-indigo-900/30 transition"
                    >
                      🎓 {language === 'vi' ? 'Đề thi THPT' : 'Academic Exam Questions'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleQuickCommand('game')} 
                      className="text-[10.5px] px-2.5 py-1 bg-purple-950/25 hover:bg-purple-900/35 rounded text-purple-300 border border-purple-900/30 transition"
                    >
                      🎮 {t.sampleIntentPlayQuiz}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT COLUMN: Active element inspect metadata and 3D Model rotation */}
            <section className="lg:col-span-5 flex flex-col bg-slate-900/50 rounded-xl border border-slate-800/70 shadow-lg overflow-hidden min-h-[400px]">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
                    BÀN RÀ SOÁT QUANTUM 3D ELECTRON
                  </h3>
                </div>
                <span className="text-[9px] text-slate-500 font-mono font-bold tracking-widest uppercase">STATE MONITOR</span>
              </div>

              {selectedElement ? (
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    
                    {/* Render Interactive 3D Bohr simulation Model */}
                    <AtomOrbitVisualizer 
                      elementNumber={selectedElement.number}
                      elementSymbol={selectedElement.symbol}
                      elementName={selectedElement.name}
                    />

                    {/* Short specs card info */}
                    <div className="flex items-start justify-between bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
                      <div className={`w-14 h-14 rounded-lg border flex flex-col justify-center items-center ${getCategoryColor(selectedElement.category)}`}>
                        <span className="text-[9px] font-mono leading-none">{selectedElement.number}</span>
                        <span className="text-xl font-extrabold leading-none my-0.5">{selectedElement.symbol}</span>
                      </div>

                      <div className="flex-1 pl-4 space-y-1">
                        <h4 className="text-base font-bold text-white tracking-tight leading-none">{selectedElement.name}</h4>
                        <span className="inline-block text-[9.5px] uppercase font-mono tracking-wider font-semibold text-slate-450">
                          {getCategoryLabel(selectedElement.category)}
                        </span>
                        <p className="text-[10px] font-mono text-sky-300 truncate max-w-[200px]" title={selectedElement.electronConfiguration}>
                           Elec: {selectedElement.electronConfiguration}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 select-text">
                      <span className="text-[9px] font-mono uppercase text-slate-500 block tracking-widest">{language === 'vi' ? 'ỨNG DỤNG THỰC TẾ & VAI TRÒ SINH HỌC' : 'REAL WORLD USAGE & CHARACTERISTICS'}</span>
                      <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-3 rounded border border-slate-850">
                        {selectedElement.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-850/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>PHYGITAL DECODER</span>
                    <span className="text-sky-500">UUID: 0x{selectedElement.number.toString(16).toUpperCase()}FF88</span>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-slate-700 animate-pulse" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 font-mono">{t.emptyReaderTitle}</p>
                    <p className="text-[11px] text-slate-500">{t.emptyReaderDesc}</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: ACHIEVEMENTS & GAMIFICATION WORKSPACE */}
        {activeTab === 'gamification' && (
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <Trophy className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {language === 'vi' ? 'BẢNG THÀNH TỰU NHÀ GIẢ KIM' : 'ALCHEMIST ACHIEVEMENTS HUB'}
                </h3>
                <p className="text-xs text-slate-400">
                   {language === 'vi' ? 'Khám phá bảng tuần hoàn và vượt qua chuyên đề kiểm tra để mở dải danh hiệu cao cấp.' : 'Explore periodic table mechanics and pass practice exam tests to unlock rare digital honors.'}
                </p>
              </div>
            </div>

            {/* Level dashboard stat blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">LEVEL GRADE</span>
                  <span className="text-xl font-bold font-mono text-indigo-300">Level {levelValue}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">CUMULATED XP</span>
                  <span className="text-xl font-bold font-mono text-emerald-300">{gameScore * 10} EXP</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono block">BADGES UNLOCKED</span>
                  <span className="text-xl font-bold font-mono text-amber-300">{unlockedBadges.length} / 5</span>
                </div>
              </div>
            </div>

            {/* Badges checklist grid list */}
            <div className="space-y-3 font-mono">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">LIST OF TRIVIA BADGES:</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                
                {[
                  { key: 'novice_alchemist', title: '🧪 Lính Mới', desc: 'Nạp thành công trò chơi đố vui bằng AI lần đầu.', border: 'border-cyan-500/35', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { key: 'halogen_expert', title: '⚡ Halogen Sư', desc: 'Quét nạp hoặc kiểm tra một nguyên tố nhóm Halogen bất kỳ.', border: 'border-teal-500/35', text: 'text-teal-400', bg: 'bg-teal-500/10' },
                  { key: 'heavy_atom', title: '⚛️ Bohr Master', desc: 'Nạp thông tin nguyên tố nặng trong bảng có Z >= 20.', border: 'border-purple-500/35', text: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { key: 'fire_lord', title: '🔥 Hỏa Thần', desc: 'Kích hoạt một phản ứng hóa học mô phỏng có độ mạo hiểm cao.', border: 'border-orange-500/35', text: 'text-orange-400', bg: 'bg-orange-500/10' },
                  { key: 'grandmaster', title: '👑 Vương Giả', desc: 'Đạt thành tích vượt bậc tích lũy trên 110 điểm số.', border: 'border-amber-500/35', text: 'text-amber-400', bg: 'bg-amber-500/10' }
                ].map((bgItem) => {
                  const unlocked = unlockedBadges.includes(bgItem.key);
                  return (
                    <div 
                      key={bgItem.key} 
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition text-center ${
                        unlocked 
                          ? `${bgItem.border} ${bgItem.bg} opacity-100` 
                          : 'border-slate-800/80 bg-slate-950/20 opacity-30 select-none'
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-bold block ${unlocked ? bgItem.text : 'text-slate-400'}`}>
                          {bgItem.title}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1.5 leading-normal font-sans">
                          {bgItem.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-850 text-[9px]">
                        {unlocked ? (
                          <span className={`font-bold flex items-center justify-center space-x-1 ${bgItem.text}`}>
                            <CheckCircle className="w-3 h-3" />
                            <span>UNLOCKED</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">LOCKED</span>
                        )}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DUAL MULTIPLAYER PVP ARENA */}
        {activeTab === 'pvp' && (
          <div className="bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-850 pb-4 gap-4">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-lg font-bold font-display text-white">
                    {language === 'vi' ? 'ĐẤU TRƯỜNG TRỰC DIỆN PVP' : 'PVP ARENA GAME MODE'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    CHẾ ĐỘ MULTIPLAYER: DUAL-PLAYER PHYSICAL RFID CARD SWIPE WAR!
                  </p>
                </div>
              </div>

              {/* Reset pvp panel */}
              <button
                type="button"
                onClick={() => {
                  setPvpRedScore(0);
                  setPvpBlueScore(0);
                  setPvpQuizIdx(0);
                  setPvpFeedback('');
                  playSynthesizedTone('beep');
                }}
                className="px-3 py-1 bg-slate-850 hover:bg-slate-800 text-slate-350 text-xs font-mono rounded border border-slate-700 hover:text-white transition flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Mở Ván Đấu Mới</span>
              </button>
            </div>

            {/* Duel scoreboard visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
              
              {/* Patient Block Red Team */}
              <div className="bg-red-950/15 border-2 border-red-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-red-500/25 border border-red-500/50 text-red-200 text-[10px] font-bold">RED TEAM (ĐỘI ĐỎ)</span>
                    <h4 className="text-xs mt-2 text-slate-400">SCOREPOINTS RECORDED:</h4>
                  </div>
                  <Users className="w-10 h-10 text-red-500/10 absolute right-3 top-3" />
                </div>
                
                <div className="text-center py-2">
                  <span className="text-5xl font-black text-red-400">{pvpRedScore} <span className="text-xs">PTS</span></span>
                </div>

                <div className="pt-2 border-t border-red-500/20 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Scan Tag simulator for Red Team:</span>
                  <div className="flex flex-wrap gap-1">
                    {['Na', 'Li', 'H', 'Fe', 'O'].map(sym => (
                      <button 
                        key={sym}
                        type="button" 
                        onClick={() => handlePvPInjectWinner('red', sym)} 
                        className="px-2 py-1 bg-red-900/10 hover:bg-red-900/30 text-red-300 rounded text-[10px] border border-red-800/30 transition"
                      >
                         Scan {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Patient Block Blue Team */}
              <div className="bg-sky-950/15 border-2 border-sky-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[170px]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-sky-500/25 border border-sky-500/50 text-sky-200 text-[10px] font-bold">BLUE TEAM (ĐỘI XANH)</span>
                    <h4 className="text-xs mt-2 text-slate-400">SCOREPOINTS RECORDED:</h4>
                  </div>
                  <Users className="w-10 h-10 text-sky-500/10 absolute right-3 top-3" />
                </div>

                <div className="text-center py-2">
                  <span className="text-5xl font-black text-sky-400">{pvpBlueScore} <span className="text-xs">PTS</span></span>
                </div>

                <div className="pt-2 border-t border-sky-500/20 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Scan Tag simulator for Blue Team:</span>
                  <div className="flex flex-wrap gap-1">
                    {['Li', 'H', 'Fe', 'C', 'N'].map(sym => (
                      <button 
                        key={sym}
                        type="button" 
                        onClick={() => handlePvPInjectWinner('blue', sym)} 
                        className="px-2 py-1 bg-sky-900/10 hover:bg-sky-900/30 text-sky-300 rounded text-[10px] border border-sky-800/30 transition"
                      >
                         Scan {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Duel Question Prompt card */}
            <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4 font-mono text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 text-[8px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">ACTIVE BOARD QUESTION</div>
              
              <div className="pt-2 text-xs text-sky-400 uppercase tracking-widest">PVP MULTIPLE CHOICE CHALLENGE: Round {pvpQuizIdx + 1}</div>
              <p className="text-lg font-bold text-slate-100 max-w-2xl mx-auto">
                 "{DEFAULT_QUIZ_QUESTIONS[pvpQuizIdx].question}"
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-2">
                {DEFAULT_QUIZ_QUESTIONS[pvpQuizIdx].options.map((opt, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-300">
                     {opt}
                  </span>
                ))}
              </div>

              {pvpFeedback && (
                <div className="p-2 bg-slate-900 border border-indigo-500/20 rounded-lg text-emerald-400 text-xs animate-bounce max-w-lg mx-auto">
                   {pvpFeedback}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: IoT TELEMETRY CONSOLE & ESP32 WIRING MAP */}
        {activeTab === 'hardware' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300 font-mono">
            
            {/* LEFT COLUMN: Telemetry list and WS status tracker */}
            <div className="lg:col-span-6 flex flex-col bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">TELEMETRY DIAGNOSTIC STACK</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleHardwareSwipeEmulator('Na')}
                  className="px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-800 text-[10px] text-sky-400 border border-slate-750 transition"
                >
                   + Simulate RFID (Na)
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex items-center justify-between text-xs">
                <span className="text-slate-400">WebSocket Node Address:</span>
                <span className="text-slate-200">ws://{window.location.host}/ws</span>
              </div>

              {/* Interactive Telemetry Log Shell */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 h-[300px] overflow-y-auto scroller-style space-y-1.5 text-[11px]">
                {telemetryLogs.length === 0 ? (
                  <p className="text-slate-600 italic">No incoming diagnostic signals logged yet...</p>
                ) : (
                  telemetryLogs.map((log, i) => (
                    <div 
                      key={i} 
                      className={`p-1.5 rounded flex items-start justify-between font-mono gap-3 border ${
                        log.level === 'SUCCESS' 
                          ? 'bg-emerald-950/25 border-emerald-500/10 text-emerald-400' 
                          : log.level === 'WARN'
                            ? 'bg-amber-950/25 border-amber-500/10 text-amber-400'
                            : log.level === 'ERROR'
                              ? 'bg-red-950/25 border-red-500/10 text-red-400'
                              : 'bg-slate-900/60 border-slate-850 text-slate-300'
                      }`}
                    >
                      <div className="flex-1">
                        <span className="opacity-40 text-[9px] mr-2">[{log.timestamp}]</span>
                        <span className="font-bold underline mr-1.5">{log.label}:</span>
                        <span>{log.details}</span>
                      </div>
                      <span className="text-[8.5px] font-bold tracking-wider opacity-60 bg-black/40 px-1 py-0.2 rounded font-mono">
                        {log.level}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: ESP32 wiring schematic and Sketch Code viewer */}
            <div className="lg:col-span-6 flex flex-col bg-slate-900/40 border border-slate-800/80 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">ESP32 ARDUINO SKETCH BUILDER</span>
                </div>
                
                {/* Copy to clipboard button */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(arduino_source);
                    playSynthesizedTone('success');
                    appendClientLog('SUCCESS', 'ARDUINO_CODE', 'Copied ESP32 complete source code template to clipboard! Ready to flash.');
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 rounded hover:text-white transition flex items-center space-x-1 text-[10px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Code</span>
                </button>
              </div>

              {/* Hardware Pin mappings summary */}
              <div className="p-3.5 bg-slate-950/85 rounded-xl border border-slate-850 text-[10.5px] text-slate-400 space-y-2">
                <span className="text-indigo-400 font-bold block">PIN WIRE CONNECTIONS (SƠ ĐỒ NỐI DÂY):</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>• ESP32 Pin 21 <span className="text-white">→</span> MFRC522 SDA</div>
                  <div>• ESP32 Pin 22 <span className="text-white">→</span> MFRC522 RST</div>
                  <div>• ESP32 Pin 23 <span className="text-white">→</span> MFRC522 MOSI</div>
                  <div>• ESP32 Pin 19 <span className="text-white">→</span> MFRC522 MISO</div>
                  <div>• ESP32 Pin 18 <span className="text-white">→</span> MFRC522 SCK</div>
                  <div>• Gnd/3v3 <span className="text-white">→</span> Reader Power Rails</div>
                </div>
              </div>

              {/* C++ Code text panel viewer */}
              <div className="relative">
                <textarea
                  value={arduino_source}
                  readOnly
                  className="w-full h-[220px] bg-slate-950 text-slate-300 text-[10.5px] font-mono p-3 rounded-lg border border-slate-850 outline-none scroller-style"
                />
                <div className="absolute bottom-2.5 right-2.5 text-[8.5px] text-slate-500 tracking-wider">C++ PRESET</div>
              </div>
            </div>

          </div>
        )}

        {/* Global Recent Swiped element logs */}
        <section className="bg-slate-900/20 rounded-lg p-4 border border-slate-850/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-mono">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
               Live tag readings history:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {scannedHistory.length === 0 ? (
              <span className="text-slate-500 italic text-[11px]">{t.emptyScansLog}</span>
            ) : (
              scannedHistory.map((sym, i) => {
                const el = getElement(sym);
                return (
                  <button 
                    key={i} 
                    type="button"
                    onClick={() => {
                      if (el) {
                         setSelectedElement(el);
                         setIsModalOpen(true);
                      }
                      playSynthesizedTone('beep');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750/80 rounded border border-slate-700 text-sky-300 flex items-center space-x-1.5 transition"
                  >
                     <span className="font-bold">{sym}</span>
                     <span className="opacity-40 text-[9px]">({el?.number})</span>
                  </button>
                );
              })
            )}
          </div>
        </section>

      </main>

      {/* Footer system branding */}
      <footer className="mt-auto px-6 py-4 bg-slate-950 border-t border-slate-850 text-center text-[11px] text-slate-500 font-mono space-y-1">
        <p>{t.footerText}</p>
        <p className="opacity-60">{t.footerSubtext}</p>
      </footer>

      {/* Element details modal */}
      {isModalOpen && selectedElement && (
        <ElementModal
          element={selectedElement}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ttsEnabled={ttsEnabled}
          isListeningGlobal={isListening}
          onSpeakText={speakTextLocal}
          gameScore={gameScore}
          onAddScore={(points) => setGameScore(p => p + points)}
          language={language}
          onSelectPrevious={() => {
            const currentIdx = ELEMENTS_DATA.findIndex(el => el.symbol === selectedElement.symbol);
            if (currentIdx > 0) {
              setSelectedElement(ELEMENTS_DATA[currentIdx - 1]);
            }
          }}
          onSelectNext={() => {
             const currentIdx = ELEMENTS_DATA.findIndex(el => el.symbol === selectedElement.symbol);
             if (currentIdx < ELEMENTS_DATA.length - 1) {
               setSelectedElement(ELEMENTS_DATA[currentIdx + 1]);
             }
          }}
        />
      )}

    </div>
  );
}
