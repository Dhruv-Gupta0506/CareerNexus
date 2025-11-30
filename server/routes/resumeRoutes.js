const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { apiLimiter, aiLimiter } = require("../middleware/rateLimiter");
const { 
  analyzeResume, 
  getHistory,
  deleteResume
} = require("../controllers/resumeController");
const authMiddleware = require("../middleware/authMiddleware");

// --- Multer Configuration (Render-safe: memory storage) ---
const storage = multer.memoryStorage();

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
router.post("/analyze", authMiddleware, aiLimiter, upload.single("resume"), analyzeResume);

// 2. Get History
router.get("/history", authMiddleware, apiLimiter, getHistory);

// 3. Delete History Item
router.delete("/history/:id", authMiddleware, deleteResume);

module.exports = router;
