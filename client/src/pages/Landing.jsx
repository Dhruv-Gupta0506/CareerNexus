import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";   // <-- FIX 1

export default function Landing() {
  const navigate = useNavigate();
  const { login, token, loading } = useAuth();      // <-- FIX 2

  // 🚀 FIX 3: Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && token) {
      navigate("/dashboard");
    }
  }, [loading, token]);

  // ================================
  // 1) Reveal animations
  // ================================
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.25 }
    );
    elements.forEach((el) => observer.observe(el));
  }, []);

  // ================================
  // 2) GOOGLE LOGIN INITIALIZATION
  // ================================
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
  }, []);

  // ================================
  // 3) GOOGLE POPUP TRIGGER
  // ================================
  const loginWithGoogle = () => google.accounts.id.prompt();

  // ================================
  // 4) HANDLE GOOGLE RESPONSE
  // ================================
  const handleGoogleResponse = async (response) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/google",
        { credential: response.credential }
      );

      login(data.token);          
      navigate("/dashboard");

    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#eef1ff] text-gray-900">

      {/* ANIMATIONS */}
      <style>{`
        .fade-left { opacity: 0; transform: translateX(-60px); transition: 0.8s ease-out; }
        .fade-right { opacity: 0; transform: translateX(60px); transition: 0.8s ease-out; }
        .fade-center { opacity: 0; transform: translateY(40px); transition: 0.8s ease-out; }
        .active { opacity: 1 !important; transform: translate(0,0) !important; }

        .premium-img-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: radial-gradient(circle at 30% 30%, rgba(150,120,255,0.12), rgba(255,255,255,0));
          pointer-events: none;
        }
      `}</style>

      {/* HERO ================================ */}
      <section
        id="hero"
        className="
          min-h-[85vh]
          flex flex-col items-center justify-center text-center px-4 sm:px-6
          fade-center reveal pt-40 sm:pt-48
        "
      >
        <h1
          className="
            text-[2rem] sm:text-[2.8rem] md:text-[4rem] lg:text-[5rem]
            font-extrabold leading-[1.1] tracking-tight text-gray-900
            max-w-4xl
          "
        >
          AI Career Assistant <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Made Simple
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed">
          Improve your resume, analyze job descriptions, and practice mock interviews —
          all powered by AI to help students and job seekers grow faster.
        </p>

        {/* CTA BUTTON */}
        <button
          onClick={loginWithGoogle}
          className="
            mt-10 px-6 sm:px-8 py-3 sm:py-3.5
            bg-gradient-to-r from-indigo-600 to-purple-600
            text-white rounded-xl text-base sm:text-lg font-semibold
            shadow-lg hover:shadow-xl hover:scale-[1.03]
            transition-all duration-300
          "
        >
          Try Career Nexus
        </button>
      </section>

      {/* FEATURES */}
      <div id="features"></div>

      <PremiumSection
        title="Smarter Resume Insights"
        subtitle="📄 AI Resume Analyzer"
        img="/resume.png"
        desc="Instant insights on strengths, weaknesses, missing keywords, and recruiter-focused improvements."
      />

      <PremiumSection
        title="Accurate JD Match Analysis"
        subtitle="🎯 Job Description Analyzer"
        img="/jd.png"
        reverse
        desc="See match %, missing skills, and tailored improvement steps based on any job description."
      />

      <PremiumSection
        title="Practice Like a Real Interview"
        subtitle="🎤 AI Mock Interviews"
        img="/interview.png"
        desc="Simulated interviews with AI scoring, coaching, and improvement suggestions."
      />

      <PremiumSection
        title="Personalized Job Insights"
        subtitle="🔍 Match Engine"
        img="/match.png"
        reverse
        desc="Deep resume vs. JD comparison to understand recruiter expectations."
      />

      <PremiumSection
        title="Instant Role-Based Resumes"
        subtitle="📝 Tailored Resume Generator"
        img="/tailor.png"
        desc="Create ATS-friendly and JD-optimized resumes instantly."
      />

      <PremiumSection
        title="Track Everything Easily"
        subtitle="📊 Dashboard History"
        img="/history.png"
        reverse
        desc="Your reports, interviews, and resumes saved automatically."
      />

      {/* FAQ */}
      <section id="faq" className="px-4 sm:px-6 py-20 sm:py-28 fade-center reveal">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-14">
          FAQ
        </h2>

        <FAQ q="Is this really free?" a="Yes — fully free for students and educational use." />
        <FAQ q="Do I need technical knowledge?" a="No. Just upload your resume or paste a JD." />
        <FAQ q="Is my data safe & private?" a="Absolutely — nothing is stored without permission, and your files remain secure." />
      </section>

      {/* FOOTER */}
      <footer className="py-10 sm:py-12 text-center text-gray-700 text-base sm:text-lg">
        Built with ❤️ for Students • Powered by MERN + AI
      </footer>
    </div>
  );
}

/* FEATURE SECTION ================================ */
function PremiumSection({ title, subtitle, desc, img, reverse }) {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center">

        <div className={`${reverse ? "lg:order-2 fade-right" : "lg:order-1 fade-left"} reveal`}>
          <h3 className="text-indigo-600 text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
            {subtitle}
          </h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
            {title}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed">
            {desc}
          </p>
        </div>

        <div
          className={`
            relative premium-img-wrapper
            w-full h-[240px] sm:h-[300px] md:h-[380px] lg:h-[420px]
            rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl
            transition-all duration-500 hover:scale-[1.04] hover:shadow-2xl hover:brightness-[1.05]
            ${reverse ? "lg:order-1 fade-left" : "lg:order-2 fade-right"} reveal
          `}
        >
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>

      </div>
    </section>
  );
}

/* FAQ ================================ */
function FAQ({ q, a }) {
  return (
    <details
      className="
        max-w-3xl mx-auto mb-5 sm:mb-6 p-5 sm:p-6 md:p-7
        border rounded-2xl bg-white shadow-md
        hover:shadow-xl transition-all
        fade-center reveal
      "
    >
      <summary className="cursor-pointer font-semibold text-lg sm:text-xl md:text-2xl">
        {q}
      </summary>
      <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg md:text-xl">
        {a}
      </p>
    </details>
  );
}
