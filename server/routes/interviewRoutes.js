const express = require("express");
const router = express.Router();
const { apiLimiter, aiLimiter } = require("../middleware/rateLimiter"); // Import Rate Limiters
const { 
  generateQuestions, 
  evaluateInterview, 
  getHistory, // Updated name
  deleteInterview // New delete function
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");

// 1. Generate Questions
// - Protected
// - AI Rate Limit (20/hour)
router.post("/generate", authMiddleware, aiLimiter, generateQuestions);

// 2. Evaluate Answers
// - Protected
// - AI Rate Limit (20/hour)
router.post("/evaluate", authMiddleware, aiLimiter, evaluateInterview);

// 3. Get Interview History
// - Protected
// - General API Limit (100/15min)
router.get("/history", authMiddleware, apiLimiter, getHistory);

// 4. Delete Interview Record
// - Protected
router.delete("/history/:id", authMiddleware, deleteInterview);

module.exports = router;