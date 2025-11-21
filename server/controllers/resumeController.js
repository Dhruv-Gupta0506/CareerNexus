const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ResumeAnalysis = require("../models/ResumeAnalysis");

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
      You are an ATS resume evaluator.
      Analyze this resume and provide:
      • Key skills
      • Strengths
      • Weaknesses
      • ATS score (0-100)
      • Missing keywords
      • Suggested job roles
      • Resume improvement suggestions
    `;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: "application/pdf"
        }
      }
    ]);

    const analysisText = result.response.text();

    // Save in DB
    await ResumeAnalysis.create({
      user: req.user.id,
      fileName: req.file.originalname,
      analysisText
    });

    // Delete file after reading
    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      analysis: analysisText
    });

  } catch (err) {
    console.error("RESUME ANALYSIS ERROR:", err);
    return res.status(500).json({
      message: "Resume analysis failed",
      error: err.message
    });
  }
};

// ---------------- HISTORY ----------------
exports.history = async (req, res) => {
  try {
    const records = await ResumeAnalysis.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      history: records
    });

  } catch (err) {
    console.error("HISTORY ERROR:", err);
    return res.status(500).json({
      message: "Failed to load history",
      error: err.message
    });
  }
};
