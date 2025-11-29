const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { apiLimiter, aiLimiter } = require("../middleware/rateLimiter"); // Import Rate Limiters
const { 
  analyzeResume, 
  getHistory, // Updated name from 'history' to 'getHistory'
  deleteResume // New delete function
} = require("../controllers/resumeController");
const authMiddleware = require("../middleware/authMiddleware");

// --- Multer Configuration (File Upload) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the ./uploads/ folder exists in your project root
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "resume-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

// --- Routes ---

// 1. Analyze Resume
// - Protected
// - AI Rate Limit (20/hour)
// - File Upload Handling
router.post("/analyze", authMiddleware, aiLimiter, upload.single("resume"), analyzeResume);

// 2. Get History
// - Protected
// - General API Limit (100/15min)
router.get("/history", authMiddleware, apiLimiter, getHistory);

// 3. Delete History Item
// - Protected
// - New feature
router.delete("/history/:id", authMiddleware, deleteResume);

module.exports = router;