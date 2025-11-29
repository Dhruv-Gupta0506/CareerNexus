const express = require("express");
const router = express.Router();
const { apiLimiter, aiLimiter } = require("../middleware/rateLimiter"); // Import Rate Limiters
const { 
  generateTailored, 
  getHistory, // Updated name from 'history'
  getById,
  deleteTailoredResume // New delete function
} = require("../controllers/tailoredController");
const authMiddleware = require("../middleware/authMiddleware");

// 1. Generate Tailored Resume
// - Protected
// - AI Rate Limit (20/hour)
router.post("/generate", authMiddleware, aiLimiter, generateTailored);

// 2. Get Tailored History
// - Protected
// - General API Limit (100/15min)
router.get("/history", authMiddleware, apiLimiter, getHistory);

// 3. Get Specific Tailored Resume by ID
// - Protected
// - General API Limit
router.get("/history/:id", authMiddleware, apiLimiter, getById);

// 4. Delete Tailored Resume
// - Protected
// - Removes record from database
router.delete("/history/:id", authMiddleware, deleteTailoredResume);

module.exports = router;