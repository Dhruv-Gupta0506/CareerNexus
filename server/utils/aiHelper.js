const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Helper: Parse JSON safely
// Sometimes AI adds ```json at the start, this cleans it up.
const tryParseJson = (text) => {
  if (!text) return null;
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    // Try to find the JSON object inside the text
    const firstBrace = clean.indexOf("{");
    const lastBrace = clean.lastIndexOf("}");
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(clean.substring(firstBrace, lastBrace + 1));
    }
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON PARSE ERROR:", err.message);
    return null;
  }
};

// 2. Helper: Retry Logic
// This fixes the "fetch failed" error. It tries 3 times before giving up.
const generateWithRetry = async (model, prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent([prompt]);
      return result;
    } catch (err) {
      console.warn(`⚠️ Gemini API Attempt ${i + 1} failed: ${err.message}`);
      
      // If it's the last attempt, throw the error so the frontend knows it failed
      if (i === retries - 1) throw err;
      
      // Wait 2 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

module.exports = { tryParseJson, generateWithRetry };