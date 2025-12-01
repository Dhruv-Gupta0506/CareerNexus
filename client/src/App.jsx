import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

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
  const { token } = useAuth();

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public - Redirects to Dashboard if logged in */}
        <Route 
          path="/" 
          element={token ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />

        {/* Protected Wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/resume" element={<ResumeAnalyzer />} />
          <Route path="/history" element={<ResumeHistory />} />

          <Route path="/jd" element={<JDAnalyzer />} />
          <Route path="/jd-history" element={<JDHistory />} />

          <Route path="/interview" element={<MockInterview />} />
          <Route path="/interview-history" element={<InterviewHistory />} />

          <Route path="/match-engine" element={<MatchEngine />} />
          <Route path="/match-history" element={<MatchHistory />} />

          <Route path="/tailored-resume" element={<TailoredResume />} />
          <Route path="/tailored-history" element={<TailoredHistory />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;