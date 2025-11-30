const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* -----------------------------------------------------------------------------
   CORS CONFIG — 100% SAFE FOR:
   - Localhost
   - Vercel deploy
   - Vercel preview builds
   - Google Auth (mobile + web)
   - Null origins
 ----------------------------------------------------------------------------- */

const staticAllowed = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // https://zyris.vercel.app
];

function isAllowed(origin) {
  // 1. Mobile Google Auth → origin = null
  if (!origin) return true;

  // 2. Exact allowed origins
  if (staticAllowed.includes(origin)) return true;

  // 3. Allow ALL *.vercel.app subdomains
  if (origin.endsWith(".vercel.app")) return true;

  // 4. Allow Google domains (GIS, avatars, fonts)
  if (
    origin.includes("google") ||
    origin.includes("gstatic") ||
    origin.includes("googleusercontent")
  ) {
    return true;
  }

  return false;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowed(origin)) callback(null, true);
      else callback(new Error(`CORS Blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* -----------------------------------------------------------------------------
   ROUTES
 ----------------------------------------------------------------------------- */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/jd", require("./routes/jdRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/tailor", require("./routes/tailoredRoutes"));

/* -----------------------------------------------------------------------------
   HEALTH CHECK
 ----------------------------------------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ message: "Zyris API Running 🚀" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/* -----------------------------------------------------------------------------
   START SERVER
 ----------------------------------------------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
