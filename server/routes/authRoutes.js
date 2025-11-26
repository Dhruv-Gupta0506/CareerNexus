const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// =============================================
// GOOGLE LOGIN (GIS popup)
// POST /api/auth/google
// =============================================
router.post("/google", authController.googleAuth);

// =============================================
// GET LOGGED-IN USER
// GET /api/auth/me
// =============================================
router.get("/me", authMiddleware, authController.me);

module.exports = router;
