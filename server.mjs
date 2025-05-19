import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import express from 'express';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());

const fallbackTips = [
  "Take a 10-minute walk and notice five things you see.",
  "Call or message someone you trust.",
  "Drink a glass of water and take three deep breaths.",
  "Try journaling one thing you’re grateful for.",
  "Listen to your favorite upbeat song.",
  "Step outside and feel the sun or fresh air.",
  "Stretch your body slowly for two minutes.",
  "Watch a funny video or meme.",
  "Remind yourself this feeling is temporary.",
  "You're not alone—many people feel this way sometimes."
];

let cachedTips = [];
let usedTipIndices = new Set();
let tipIndex = 0;
let update = false;

async function updateGeminiTips() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `
        Return raw text containing 10 positive tips for someone feeling sad. 
        Please provide an obscure suggestion as a single sentence for each 
        these, dont mention things like getting sunlight or taking walks, 
        and return them as a colon seperated list, with [ and ] terminating 
        the list` }]
      }]
    });
    const content = result.response.text();

    let all = content.split('[');
    let middle = all[1].split(']')[0];
    // Split by colon
    const parts = middle.split(':');
    // Trim whitespace from each item
    const tips = parts.map(part => part.trim()).filter(Boolean);

    // console.log("tips: ", tips);
    // console.log("Tips Size: ", tips.length);

    cachedTips = tips;
    usedTipIndices.clear();
    tipIndex = 0;
    console.log("Gemini Call executed Successfully: Cache Updated");
    
  } catch (err) {
    console.warn("⚠️ Gemini tips fetch failed. Falling back.", err.message);
    if (cachedTips.length === 0) {
      cachedTips = fallbackTips;
    }
  }
}

updateGeminiTips();

// Middleware to check for valid token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token || token !== `Bearer ${process.env.API_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }

  next();
}

app.post('/microtips', authenticateToken, async (req, res) => {
  const { user_id, mood } = req.body;
  console.log("\nPOST request received and authenticated!")

  if (!user_id || !mood) {
    return res.status(400).json({ error: 'Bad Request: user_id and mood are required' });
  }

  console.log("User ID: ", user_id);
  console.log("Mood: ", mood);

  if (mood === "😢") {
    if (cachedTips.length === 0) cachedTips = fallbackTips;

    const selectedTip = cachedTips[tipIndex % cachedTips.length];
    usedTipIndices.add(tipIndex % cachedTips.length);
    tipIndex++;

    const res_json = { user_id: user_id, timestamp: new Date().toISOString(), tip: selectedTip};
    console.log("Response: ", res_json);

    res.json(res_json);
    if (usedTipIndices.size >= 5) {
      updateGeminiTips();
    }
  }
  else {
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Mood tip microservice running at http://localhost:${port}`);
});
