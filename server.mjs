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
        Please provide a simple sentence for each these, and return them as 
        a colon seperated list, with [ and ] terminating the list` }] }]
    });
    const content = result.response.text();

    // Remove everything before and including first '['
    let trimmed = content.replace(/^.*?\[/, '');
    // Remove everything after and including last ']'
    trimmed = trimmed.replace(/\].*$/, '');
    // Split by colon
    const parts = trimmed.split(':');
    // Trim whitespace from each item
    const tips = parts.map(part => part.trim()).filter(Boolean);

    // console.log("tips: ", tips);
    // console.log("Tips Size: ", tips.length);

    cachedTips = tips;
    usedTipIndices.clear();
    tipIndex = 0;
    console.log("tips updated");
    
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

  if (mood === "😢") {
    if (cachedTips.length === 0) cachedTips = fallbackTips;

    const selectedTip = cachedTips[tipIndex % cachedTips.length];
    usedTipIndices.add(tipIndex % cachedTips.length);
    tipIndex++;

    res.json({
      user_id,
      timestamp: new Date().toISOString(),
      tip: selectedTip
    });
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
