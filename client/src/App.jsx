import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* Pages */
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeHistory from "./pages/ResumeHistory";
import JDAnalyzer from "./pages/JDAnalyzer";
import JDHistory from "./pages/JDHistory";
import MockInterview from "./pages/MockInterview";
import InterviewHistory from "./pages/InterviewHistory";
import MatchEngine from "./pages/MatchEngine";
import MatchHistory from "./pages/MatchHistory";
import TailoredResume from "./pages/TailoredResume";
import TailoredHistory from "./pages/TailoredHistory";

/* Components */
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  // 🧹 Cleanup: No login/register pages anymore → navbar always visible
  const hideNavbar = false;

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Landing Page - Public */}
        <Route path="/" element={<Landing />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ResumeHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jd"
          element={
            <ProtectedRoute>
              <JDAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jd-history"
          element={
            <ProtectedRoute>
              <JDHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-history"
          element={
            <ProtectedRoute>
              <InterviewHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match-engine"
          element={
            <ProtectedRoute>
              <MatchEngine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match-history"
          element={
            <ProtectedRoute>
              <MatchHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tailored-resume"
          element={
            <ProtectedRoute>
              <TailoredResume />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tailored-history"
          element={
            <ProtectedRoute>
              <TailoredHistory />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>   
  );
}

export default App;
