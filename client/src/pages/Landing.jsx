import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { login, token, loading } = useAuth();

  // Auto-redirect if logged in
  useEffect(() => {
    if (!loading && token) {
      navigate("/dashboard");
    }
  }, [loading, token]);

  // Reveal animations
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

  // Google Login Init
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
  }, []);

  const loginWithGoogle = () => google.accounts.id.prompt();

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
    <div className="relative w-full min-h-screen text-[#111827] overflow-hidden">

      {/* PREMIUM BACKGROUND */}
      <div className="
        absolute inset-0 -z-10 
        bg-gradient-to-br from-[#f7f8ff] via-[#eef0ff] to-[#e7e9ff]
      "></div>

      {/* GLOW SPOTLIGHT */}
      <div className="
        absolute top-[-200px] left-1/2 -translate-x-1/2 
        w-[900px] h-[900px]
        bg-[radial-gradient(circle,rgba(150,115,255,0.18),transparent_70%)]
        blur-[120px] -z-10
      "></div>

      {/* SOFT FADE AT BOTTOM OF HERO (HIDES NEXT SECTION PREVIEW) */}
      <div className="
        absolute bottom-0 left-0 w-full h-28 
        bg-gradient-to-b from-transparent to-[#f7f8ff]
        pointer-events-none
        z-10
      "></div>

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
          background: radial-gradient(circle at 30% 30%, rgba(180,150,255,0.14), rgba(255,255,255,0));
          pointer-events: none;
        }
      `}</style>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="
          min-h-screen
          flex flex-col items-center justify-center text-center
          px-4 sm:px-6 fade-center reveal pb-24
        "
      >

        {/* HERO TITLE */}
        <h1
          className="
            text-[55px] sm:text-[70px] md:text-[85px] lg:text-[95px]
            font-extrabold leading-[1.05] tracking-tight 
            max-w-5xl
          "
        >
          Career Made <br />
          <span className="bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-transparent bg-clip-text drop-shadow-md">
            Simple
          </span>
        </h1>

        {/* TAGLINE */}
        <p className="mt-6 text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-gray-600 max-w-2xl leading-relaxed">
          Smarter Career Decisions, Powered by AI.
        </p>


        {/* CTA BUTTON */}
        <button
          onClick={loginWithGoogle}
          className="
            mt-10 px-8 sm:px-10 py-3.5
            bg-gradient-to-r from-fuchsia-500 to-indigo-600
            text-white rounded-lg 
            text-base sm:text-lg font-semibold
            shadow-[0_4px_25px_rgba(120,50,255,0.25)]
            hover:shadow-[0_6px_30px_rgba(120,50,255,0.35)]
            hover:scale-[1.045]
            transition-all duration-300
          "
        >
          Try Zyris
        </button>
      </section>

      {/* FEATURES */}
      <div id="features"></div>

      <PremiumSection
        title="Smarter Resume Insights"
        subtitle="📄 AI Resume Analyzer"
        img="/resume.png"
        desc="Instant insights on strengths, weaknesses, keywords, and recruiter-focused improvements."
      />

      <PremiumSection
        title="Accurate JD Match Analysis"
        subtitle="🎯 Job Description Analyzer"
        img="/jd.png"
        reverse
        desc="See match %, missing skills, and tailored improvement steps for any JD."
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
        desc="Deep resume–JD comparison to understand recruiter expectations."
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
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
          FAQ
        </h2>

        <FAQ q="Is this really free?" a="Yes — fully free for students and educational use." />
        <FAQ q="Do I need technical knowledge?" a="No. Just upload your resume or paste a JD." />
        <FAQ q="Is my data safe & private?" a="Absolutely — your data remains private and secure." />
      </section>

      {/* FOOTER */}
      <footer className="py-10 sm:py-12 text-center text-gray-700 text-base sm:text-lg">
        Built with ❤️ for Students • Powered by MERN + AI
      </footer>
    </div>
  );
}


/* FEATURE SECTION */
function PremiumSection({ title, subtitle, desc, img, reverse }) {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-24 items-center">

        <div className={`${reverse ? "lg:order-2 fade-right" : "lg:order-1 fade-left"} reveal`}>
          <h3 className="text-fuchsia-600 text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-4">
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


/* FAQ COMPONENT */
function FAQ({ q, a }) {
  return (
    <details
      className="
        max-w-3xl mx-auto mb-6 sm:mb-8 p-6 sm:p-7 md:p-8
        rounded-2xl border
        bg-gradient-to-br from-white to-[#fafbff]
        shadow-[0_5px_20px_rgba(150,115,255,0.12)]
        hover:shadow-[0_5px_30px_rgba(150,115,255,0.22)]
        transition-all duration-300
        fade-center reveal
      "
    >
      <summary className="cursor-pointer font-semibold text-lg sm:text-xl md:text-2xl">
        {q}
      </summary>
      <p className="mt-4 text-gray-600 text-base sm:text-lg md:text-xl">
        {a}
      </p>
    </details>
  );
}
