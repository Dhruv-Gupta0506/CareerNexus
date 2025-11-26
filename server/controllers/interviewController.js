const { GoogleGenerativeAI } = require("@google/generative-ai");
const Interview = require("../models/Interview");
const crypto = require("crypto");

// =========================================================
// ROLE CATEGORY CLASSIFIER
// =========================================================
function detectCategory(role) {
  const r = role.toLowerCase();

  if (r.includes("frontend") || r.includes("react") || r.includes("ui") || r.includes("vue") || r.includes("angular"))
    return "frontend";

  if (r.includes("backend") || r.includes("node") || r.includes("java") || r.includes("spring") || r.includes("django") || r.includes("golang"))
    return "backend";

  if (r.includes("fullstack") || r.includes("full stack") || r.includes("mern"))
    return "fullstack";

  if (r.includes("ios") || r.includes("android") || r.includes("mobile") || r.includes("react native") || r.includes("flutter"))
    return "mobile";

  if (r.includes("data") || r.includes("ml") || r.includes("ai") || r.includes("analyst"))
    return "data";

  if (r.includes("devops") || r.includes("cloud") || r.includes("aws") || r.includes("gcp") || r.includes("azure"))
    return "devops";

  if (r.includes("game") || r.includes("unity") || r.includes("unreal"))
    return "game";

  if (r.includes("sde") || r.includes("software engineer") || r.includes("developer"))
    return "sde";

  return "generic";
}

// =========================================================
// GENERATE QUESTIONS (FINAL VERSION)
// =========================================================
exports.generateQuestions = async (req, res) => {
  try {
    const { role, difficulty, questionCount } = req.body;
    if (!role || !difficulty || !questionCount)
      return res.status(400).json({ message: "Missing required fields" });

    const category = detectCategory(role);
    const seed = crypto.randomUUID();

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      .getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: difficulty === "easy" ? 0.45 :
                      difficulty === "medium" ? 0.65 : 0.85
        }
      });

    const prompt = `
Generate exactly ${questionCount} interview questions.

ROLE: ${role}
CATEGORY: ${category}
DIFFICULTY: ${difficulty}

==============================
GLOBAL RULES
==============================
- EXACTLY ${questionCount} questions.
- Number them 1,2,3...
- NO answers. NO examples. NO explanation.
- Strictly role-relevant.
- No mixing categories.
- ZERO fluff sentences.

==============================
CATEGORY RULES
==============================

FRONTEND:
- React, JS, state, hooks, rendering, optimization
- CSS, accessibility, async fetch
- Light coding only (NO DSA)

BACKEND:
- APIs, DB schema, authentication, transactions
- Scalability, caching, queues
- Implementation-focused coding

FULLSTACK:
- Mix of frontend + backend REAL tasks
- API design, component design, DB queries

MOBILE:
- Lifecycle, local storage, navigation, UI patterns

DATA:
- SQL, pandas, NumPy, pipelines
- ONLY data-relevant algorithms

DEVOPS:
- Docker, Kubernetes, CI/CD, networking
- NO coding questions

GAME DEV:
- Game loop, ECS, physics, rendering

SDE:
- Balanced mix of coding + systems
- DSA allowed: 
  EASY → array/string
  MEDIUM → binary search, intervals, hashing
  HARD → DP, trees, graphs

GENERIC:
- General tech questions only

==============================
CODING QUESTION RULE
==============================
If the role category REQUIRES coding AND ${questionCount} ≥ 2:
- At least ${Math.ceil(questionCount * 0.5)} MUST be coding questions.

==============================
SEED: ${seed}
==============================

Return ONLY the numbered questions.
`;

    const response = await ai.generateContent([{ text: prompt }]);
    const raw = response.response.text();

    const questions = raw.split("\n")
      .map(q => q.trim())
      .filter(q => q.length > 3)
      .slice(0, questionCount);

    return res.json({ success: true, questions });

  } catch (err) {
    console.error("QUESTION GEN ERROR:", err);
    return res.status(500).json({ message: "Failed to generate questions" });
  }
};

// =========================================================
// EVALUATE ANSWERS (FINAL VERSION)
// =========================================================
exports.evaluateInterview = async (req, res) => {
  try {
    const { role, difficulty, questionCount, questions, answers } = req.body;

    if (!questions || !answers)
      return res.status(400).json({ message: "Missing data" });

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      .getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { temperature: 0.05 }
      });

    const prompt = `
You are a senior interviewer evaluating a candidate for: ${role}.

==============================
STRICT FORMAT
==============================

Q1 Evaluation:
Score: XX/100
Strengths:
- bullet
Weaknesses:
- bullet
Suggested Improved Answer:
text only
Improvement Tip:
text

(Repeat EXACTLY ${questionCount} times)

==============================
FINAL BLOCK
==============================

Overall Summary:
Overall Score: XX/100
Key Strengths:
- bullet
Key Weaknesses:
- bullet
Improvement Plan:
- bullet
Encouraging Closing Remark:
one short line

==============================
RULES
==============================
- Do NOT repeat the questions.
- Do NOT repeat the user answers.
- NO markdown. NO backticks.
- Coding answers judged strictly.
- Theoretical answers must be deep & clear.
- Be direct and technical. No filler.

QUESTIONS:
${questions.join("\n")}

ANSWERS:
${answers.join("\n")}
`;

    const response = await ai.generateContent([{ text: prompt }]);
    const evaluationText = response.response.text();

    const scoreMatch = evaluationText.match(/Overall Score:\s*(\d{1,3})/i);
    const score = scoreMatch ? Math.min(Math.max(parseInt(scoreMatch[1]), 0), 100) : 50;

    const saved = await Interview.create({
      user: req.user,
      role,
      difficulty,
      questionCount,
      questions,
      answers,
      evaluationText,
      score
    });

    return res.json({
      success: true,
      evaluation: evaluationText,
      score,
      id: saved._id
    });

  } catch (err) {
    console.error("EVALUATION ERROR:", err);
    return res.status(500).json({ message: "Interview evaluation failed" });
  }
};

// =========================================================
// HISTORY
// =========================================================
exports.history = async (req, res) => {
  try {
    const records = await Interview.find({ user: req.user })
      .sort({ createdAt: -1 });

    return res.json({ success: true, history: records });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to load history",
      error: err.message
    });
  }
};
