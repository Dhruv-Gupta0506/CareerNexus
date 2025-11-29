const express = require("express");
const router = express.Router();
const { apiLimiter, aiLimiter } = require("../middleware/rateLimiter"); // Import Rate Limiters
const { 
  analyzeMatch, 
  getHistory, // Updated name from 'matchHistory' to 'getHistory'
  deleteMatch // New delete function
} = require("../controllers/matchController");
const authMiddleware = require("../middleware/authMiddleware");

// 1. Run Match Analysis
// - Protected
// - AI Rate Limit (20/hour)
router.post("/analyze", authMiddleware, aiLimiter, analyzeMatch);

// 2. Get Match Analysis History
// - Protected
// - General API Limit (100/15min)
router.get("/history", authMiddleware, apiLimiter, getHistory);

// 3. Delete Match Record
// - Protected
// - Removes the record from the database
router.delete("/history/:id", authMiddleware, deleteMatch);

module.exports = router;