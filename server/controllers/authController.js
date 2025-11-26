const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

// Create JWT
function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

// ===================================================================================
// GOOGLE LOGIN (GIS POPUP TOKEN)
// ===================================================================================
exports.googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: "Google access_token missing" });
    }

    // Fetch Google user info
    const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      params: { access_token },
    });

    const profile = googleRes.data;

    if (!profile || !profile.email) {
      return res.status(400).json({ message: "Invalid Google user data" });
    }

    // Check existing user
    let user = await User.findOne({ email: profile.email });

    // If new Google login user, create entry
    if (!user) {
      user = await User.create({
        name: profile.name || "No Name",
        email: profile.email,
        avatar: profile.picture || "",
        password: null, // Google users have no password
        provider: "google",
      });
    } else {
      // Update avatar/name from Google (optional)
      let changed = false;

      if (profile.name && user.name !== profile.name) {
        user.name = profile.name;
        changed = true;
      }

      if (profile.picture && user.avatar !== profile.picture) {
        user.avatar = profile.picture;
        changed = true;
      }

      if (changed) await user.save();
    }

    // Create JWT
    const token = generateToken(user._id);

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error?.response?.data || error.message);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

// ===================================================================================
// GET LOGGED-IN USER (Protected)
// ===================================================================================
exports.me = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = await User.findById(req.user).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
