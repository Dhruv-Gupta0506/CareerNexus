const express = require("express");
const router = express.Router();
const { apiLimiter, aiLimiter } = require("../middleware/rateLimiter"); // Import Rate Limiters
const { 
  analyzeJob, 
  getHistory, // Updated name from 'history' to 'getHistory'
  deleteJob   // New delete function
} = require("../controllers/jdController");
const authMiddleware = require("../middleware/authMiddleware");

// 1. Analyze Job Description
// - Protected: Logged in users only
// - AI Rate Limit: 20 requests/hour to prevent quota abuse
router.post("/analyze", authMiddleware, aiLimiter, analyzeJob);

// 2. Get JD History
// - Protected
// - General API Limit: 100 requests/15min
router.get("/history", authMiddleware, apiLimiter, getHistory);

// 3. Delete JD History Item
// - Protected
// - Removes the record from the database
router.delete("/history/:id", authMiddleware, deleteJob);

module.exports = router;