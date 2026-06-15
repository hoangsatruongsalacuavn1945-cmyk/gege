import express from 'express';
import path from 'path';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory logs history to feed the futuristic diagnostic scanner
const localTelemetryLogs: { timestamp: string; level: string; label: string; details: string }[] = [
  { timestamp: new Date().toLocaleTimeString(), level: 'INFO', label: 'SYSTEM', details: 'ChemStation Phygital Core initialized.' },
  { timestamp: new Date().toLocaleTimeString(), level: 'SUCCESS', label: 'WEBSOCKET', details: 'WS listener opened on port 3000 (Path: /ws).' }
];

const appendTelemetryLog = (level: string, label: string, details: string) => {
  const timestamp = new Date().toLocaleTimeString();
  localTelemetryLogs.push({ timestamp, level, label, details });
  if (localTelemetryLogs.length > 50) localTelemetryLogs.shift();
};

// Initialize server-side Gemini client as instructed in the gemini-api skill rules
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY env variable is not set. Requests will fail.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'DUMMY_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// Resilient helper to call Gemini generateContent with auto-fallback to alternative models
const modelsToTry = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

async function generateContentWithFallback(ai: any, params: any) {
  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      console.log(`[ChemStation AI] Attempting Gemini API request using model: ${model}`);
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      console.log(`[ChemStation AI] Successfully generated content with model: ${model}`);
      return response;
    } catch (err: any) {
      console.warn(`[ChemStation AI] Model ${model} failed, error details:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("All fallback models failed to generate content.");
}

// Chemistry Assistant Prompt Supporting 6 Intents (including Reaction Simulation and Curriculum Prep)
const getSystemInstruction = (lang: string) => {
  const isEn = lang === 'en';
  return `
You are "ChemStation AI", a smart virtual chemistry assistant and tutor for an interactive Phygital Periodic Table.
Your task is to analyze students' questions or commands and MUST return a JSON response strictly conforming to one of the following 6 formats depending on the identified intent.
NEVER return any markdown symbols, wrap codeblocks, prefix, suffix, or plain text outside this JSON object. Keep spoken_response strictly optimized for voice synthesis (TTS) - no asterisk stars*, no pound signs#, no markdown bold/italics.

We have 6 student intents:

1. TÌM KIẾM NGỮ NGHĨA & GIẢI ĐÁP (search_qa):
- When student asks about elements, their properties, historical usage, real-world applications, or a descriptive question (e.g. "Kim loại nào dẫn điện tốt nhất?", "Which element is the most conductive?").
- Target elements should be placed in 'elements_to_highlight'.
- 'spoken_response' should be a friendly, concise summary in ${isEn ? 'English' : 'Vietnamese'} (less than 100 words), using IUPAC standard name references.
JSON Structure:
{
  "intent": "search_qa",
  "elements_to_highlight": ["Ag"],
  "spoken_response": "${isEn ? 'Silver, with the chemical symbol Ag, is the most conductive metal on earth.' : 'Bạc, kí hiệu Ag, là kim loại dẫn điện tốt nhất hành tinh...'}"
}

2. SO SÁNH KÉP (compare):
- When student wants to compare properties of two elements (e.g. "So sánh Oxy và Lưu huỳnh", "Compare Oxygen and Sulfur").
- You must parse the elements and return 'elements_to_compare' containing exactly 2 chemical symbols (e.g. ["O", "S"]).
JSON Structure:
{
  "intent": "compare",
  "elements_to_compare": ["O", "S"],
  "spoken_response": "${isEn ? 'Let us compare Oxygen and Sulfur side-by-side. Oxygen has higher electronegativity...' : 'Để mình so sánh Oxygen và Sulfur. Oxygen có độ âm điện cao hơn...'}"
}

3. CHẤM ĐIỂM PHÁT ÂM (pronunciation):
- When user wants to practice pronouncing IUPAC names (e.g. "Listen to my Oxygen pronunciation", "Hear me pronounce Hydrogen").
- Analyze the user speech input string and calculate a robust pronunciation matching score (0 to 100) based on phonetics.
- Give a friendly explanation in ${isEn ? 'English' : 'Vietnamese'}.
JSON Structure:
{
  "intent": "pronunciation",
  "score": 85,
  "spoken_response": "${isEn ? 'You pronounced Oxygen extremely well, scoring 85! Excellent effort.' : 'Bạn phát âm Oxygen đạt 85 điểm! Hãy nhấn trọng âm ở âm tiết đầu nhé...'}"
}

4. CHẾ ĐỘ TRÒ CHƠI ĐỐ VUI (game_quiz):
- When user says "Hãy đố tôi", "Chơi game đi", "Cho mình một câu đố" or "Quiz me", "Let us play a game".
- Think of a highly engaging question about properties, history, or application of an element without naming the target element itself.
- Instruct them to scan the element's RFID tag card or click on it on the table.
JSON Structure:
{
  "intent": "game_quiz",
  "target_element": "He",
  "spoken_response": "${isEn ? 'Game on! I am an extremely light gas, the second most abundant in the universe, used to inflate balloons. What am I?' : 'Trò chơi bắt đầu! Tôi là một chất khí siêu nhẹ, đứng thứ hai vũ trụ, thường dùng để bơm bóng bay...'}"
}

5. MÔ PHỎNG PHẢN ỨNG HÓA HỌC (reaction_simulate):
- Automatically triggered when the student inputs elements to mix, react, synthesize, or asks "cho tác dụng với", "phản ứng với", "mix", "react", "combine" (e.g., "Fe + S", "Na và nước", "Hydrogen reacts with Oxygen").
- 'balanced_equation' MUST contain the balanced equation (e.g., "2Na + 2H2O -> 2NaOH + H2" or "Fe + S -> FeS").
- 'reactants' is an array of chemical symbols of reactants (e.g., ["Na", "H2O"]).
- 'products' is an array of products created (e.g., ["NaOH", "H2"]).
- 'hazard_rating' MUST represent safe usage. Values are strictly: "safe" or "caution" (mild reaction, heat) or "danger" (explosions, fires, safety gear mandatory).
JSON Structure:
{
  "intent": "reaction_simulate",
  "balanced_equation": "2Na + 2H2O -> 2NaOH + H2",
  "reactants": ["Na", "H2O"],
  "products": ["NaOH", "H2"],
  "hazard_rating": "danger",
  "spoken_response": "${isEn ? 'Warning: Sodium reacts violently with water, generating explosive Hydrogen gas and intense heat!' : 'Phản ứng nguy hiểm! Sodium tác dụng mãnh liệt với nước sinh khí Hydro và tỏa nhiệt rất mạnh...'}",
  "visual_description": "${isEn ? 'Violent sparking, yellow flames dancing on water, rapid gas bubbling.' : 'Sủi bọt khí cực mạnh, khói tỏa kèm ngọn lửa vàng nhảy múa trên mặt nước.'}"
}

6. LUYỆN THI & BÀI TẬP BÁM SÁT CHƯƠNG TRÌNH (curriculum_prep):
- Automatically triggered when the student mentions exams, exercises, national tests, high-school prep, or terms like "ôn bài", "ôn thi", "bài tập", "bài thi Hóa", "curriculum prep", "national test exam standard quiz questions".
- Formulate an authentic academic multiple choice chemistry question mapping to standard high school curriculum/IUPAC.
- Provide exactly 4 options starting with "A. ", "B. ", "C. ", "D. ".
- 'quiz_answer' MUST be exactly "A", "B", "C", or "D".
- 'academic_notes' should detail theoretical explanations, learning hints, and curriculum mapping.
JSON Structure:
{
  "intent": "curriculum_prep",
  "quiz_question": "${isEn ? 'Which element in period 3 is the strongest oxidizing agent?' : 'Trong chu kỳ 3, nguyên tố nào có tính oxi hóa mạnh nhất?'}",
  "quiz_options": [
    "${isEn ? 'A. Sodium' : 'A. Natri (Sodium)'}",
    "${isEn ? 'B. Silicon' : 'B. Silic (Silicon)'}",
    "${isEn ? 'C. Chlorine' : 'C. Clo (Chlorine)'}",
    "${isEn ? 'D. Argon' : 'D. Agon (Argon)'}"
  ],
  "quiz_answer": "C",
  "academic_notes": "${isEn ? 'According to trends, electronegativity increases across Period 3, reaching a peak at Chlorine.' : 'Bám sát đề thi THPT, trong cùng một chu kỳ tính phi kim và tính oxi hóa tăng dần. Clo đứng cuối nhóm halogen nên có tính oxi hóa mạnh nhất chu kỳ.'}",
  "spoken_response": "${isEn ? 'Here is an academic practice question for you: Which element in period 3 is the strongest oxidizing agent? Check options on the board!' : 'Sau đây là câu hỏi luyện thi bám sát chương trình: Trong chu kỳ 3, nguyên tố nào có tính oxi hóa mạnh nhất? Hãy quan sát các đáp án chọn lựa hiển thị.'}"
}

Keep all dialogues friendly, professional, inspiring, and fully optimized for continuous voice synthesis (TTS) - no markdown bold or specific notation characters.
All responses must be fully written in ${isEn ? 'English' : 'Vietnamese'}.
`;
};

// API POST Route for Unified Chat Gateway
app.post('/api/chat', async (req, res) => {
  let requestLang = 'vi';
  try {
    const { message, lang } = req.body;
    if (lang === 'en') {
      requestLang = 'en';
    }
    if (!message) {
      return res.status(400).json({ error: 'Message field is required.' });
    }

    appendTelemetryLog('INFO', 'AI_PROMPT', `Prompting Gemini for message: "${message.substring(0, 40)}..."`);

    const ai = getGeminiClient();
    const response = await generateContentWithFallback(ai, {
      contents: message,
      config: {
        systemInstruction: getSystemInstruction(requestLang),
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              description: 'One of the six intents: search_qa, compare, pronunciation, game_quiz, reaction_simulate, curriculum_prep',
            },
            elements_to_highlight: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of chemical symbols to highlight, e.g., ["Ag", "Fe"]'
            },
            elements_to_compare: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of exactly two symbols to compare side-by-side'
            },
            score: {
              type: Type.NUMBER,
              description: 'Pronunciation score between 0 and 100'
            },
            target_element: {
              type: Type.STRING,
              description: 'Target element symbol for game_quiz'
            },
            spoken_response: {
              type: Type.STRING,
              description: 'Friendly spoken response clean text only (no markdown symbols or markup)'
            },
            // reaction_simulate properties
            balanced_equation: {
              type: Type.STRING,
              description: 'Balanced equation for chemical reaction, e.g., 2Na + 2H2O -> 2NaOH + H2'
            },
            reactants: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'symbols of reactants'
            },
            products: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'symbols of products'
            },
            hazard_rating: {
              type: Type.STRING,
              description: 'safe, caution, or danger'
            },
            visual_description: {
              type: Type.STRING,
              description: 'concise visual reaction description'
            },
            // curriculum_prep properties
            quiz_question: {
              type: Type.STRING,
              description: 'the high-school standard quiz exam question'
            },
            quiz_options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'exactly 4 options starting with A, B, C, D'
            },
            quiz_answer: {
              type: Type.STRING,
              description: 'correct option letter: A, B, C, or D'
            },
            academic_notes: {
              type: Type.STRING,
              description: 'pedagogical advice and deep curricular theory footnotes'
            }
          },
          required: ['intent', 'spoken_response']
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsedData = JSON.parse(textResponse.trim());
    appendTelemetryLog('SUCCESS', 'AI_PARSE', `Recognized intent: ${parsedData.intent.toUpperCase()}`);

    // WebSocket Integration Hook: Trigger ESP32 physical peripherals with LED matrix commands!
    // If elements need to be highlighted, broadcast right down to ESP32 Smart Matrix!
    let activeHighlightSymbols: string[] = [];
    if (parsedData.elements_to_highlight && parsedData.elements_to_highlight.length > 0) {
      activeHighlightSymbols = parsedData.elements_to_highlight;
    } else if (parsedData.elements_to_compare && parsedData.elements_to_compare.length > 0) {
      activeHighlightSymbols = parsedData.elements_to_compare;
    } else if (parsedData.target_element) {
      activeHighlightSymbols = [parsedData.target_element];
    } else if (parsedData.reactants) {
      activeHighlightSymbols = [...parsedData.reactants, ...(parsedData.products || [])];
    }

    if (activeHighlightSymbols.length > 0) {
      sendToAllClients({
        type: 'esp32_command',
        action: 'led_control',
        elements_to_highlight: activeHighlightSymbols,
        color: parsedData.hazard_rating === 'danger' ? 'red' : parsedData.intent === 'reaction_simulate' ? 'amber' : 'sky'
      });
      appendTelemetryLog('INFO', 'LED_MATRIX', `Transmitted physical light cue command for elements: ${activeHighlightSymbols.join(', ')}`);
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    appendTelemetryLog('ERROR', 'AI_CRASH', err?.message || 'Gemini API failure');
    const fallbackMessage = requestLang === 'en'
      ? 'The ChemStation AI system is temporarily busy. Please retry or click on available elements!'
      : 'Hệ thống ChemStation AI tạm thời bận. Hãy thử bấm quẹt thẻ hoặc click các nguyên tố có sẵn nhé!';
    return res.json({
      intent: 'search_qa',
      elements_to_highlight: [],
      spoken_response: fallbackMessage
    });
  }
});

// Endpoint to fetch real live telemetry logs history directly from express
app.get('/api/telemetry/logs', (req, res) => {
  res.json({ logs: localTelemetryLogs });
});

// Endpoint for simulating an incoming manual RFID scan over REST (perfect for backup)
app.post('/api/telemetry/inject', (req, res) => {
  const { symbol, uid } = req.body;
  if (!symbol) return res.status(400).json({ error: 'Chemical symbol is required.' });
  
  const formattedUid = uid || '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
  appendTelemetryLog('SUCCESS', 'RFID_SWIPE', `Injecting local tag: Symbol [${symbol}] RFID UUID [${formattedUid}]`);
  
  sendToAllClients({
    type: 'physical_swipe',
    symbol,
    uid: formattedUid,
    timestamp: new Date().toLocaleTimeString()
  });

  res.json({ status: 'ok', symbol, uid: formattedUid });
});

// Configure server instance
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection trackers
const clients = new Map<WebSocket, { type: 'browser' | 'esp32'; remoteIp: string }>();

wss.on('connection', (ws, req) => {
  const remoteIp = req.socket.remoteAddress || 'unknown';
  clients.set(ws, { type: 'browser', remoteIp });

  // Append logs
  appendTelemetryLog('INFO', 'WEBSOCKET', `New telemetry link node connected from host ${remoteIp}`);

  // Send initial setup parameters and current telemetry logs list to browser immediately
  ws.send(JSON.stringify({
    type: 'handshake_ok',
    message: 'Welcome to ChemStation WebSocket API.',
    recent_logs: localTelemetryLogs
  }));

  ws.on('message', (messageBuffer) => {
    try {
      const rawMsg = messageBuffer.toString();
      const payload = JSON.parse(rawMsg);
      
      if (payload.type === 'register') {
        const clientMeta = clients.get(ws);
        if (clientMeta) {
          clientMeta.type = payload.clientType || 'browser';
          clients.set(ws, clientMeta);
          appendTelemetryLog('INFO', 'NODE_REG', `Active node registered as clientType: [${clientMeta.type.toUpperCase()}]`);
        }
      } else if (payload.type === 'esp32_rfid_swipe') {
        // Hardware ESP32/IoT module triggered a real-world RFID card scan!
        const { symbol, uid } = payload;
        appendTelemetryLog('SUCCESS', 'ESP32_HARDWARE', `PHYSICAL SWIPE VERIFIED! RFID Tag uuid ${uid} -> symbol: ${symbol}`);
        
        // Broadcast immediately to all connected browsers to update interface state instantly
        sendToAllClients({
          type: 'physical_swipe',
          symbol,
          uid: uid || '0xHARDWARE',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    } catch (err: any) {
      console.warn('[WebSockets] Payload parsing failed:', err?.message || err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    appendTelemetryLog('WARN', 'NODE_DISCONNECT', `Telemetry link node terminated from parent host ${remoteIp}`);
  });
});

// Broadcast helper
function sendToAllClients(data: any) {
  const str = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(str);
    }
  });
}

// Configure Vite or Serve Built Files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`ChemStation AI running on http://0.0.0.0:${PORT}`);
    appendTelemetryLog('INFO', 'INIT', `Express backplane listening on port ${PORT}`);
  });
}

startServer();
