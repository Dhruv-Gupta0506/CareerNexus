import { useEffect } from "react";
import axios from "axios";

export default function Landing() {
  // ================================
  // 1) Reveal animations (unchanged)
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
  // 2) GOOGLE LOGIN (NEW GIS POPUP)
  // ================================
  const handleGoogleLogin = () => {
    google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "email profile openid",
      callback: async (response) => {
        try {
          // Send the access_token to backend
          const { data } = await axios.post(
            "http://localhost:5000/api/auth/google",
            { access_token: response.access_token }
          );

          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("❌ Google Login Error:", error);
        }
      },
    }).requestAccessToken();
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

      {/* HERO */}
      <section
        id="hero"
        className="
          min-h-[92vh]
          flex flex-col items-center justify-center text-center px-6
          fade-center reveal pt-48
        "
      >
        <h1
          className="
            text-[2.6rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem]
            font-extrabold leading-[1.05] tracking-tight text-gray-900
          "
        >
          AI Career Assistant <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Made Simple
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed">
          Improve your resume, analyze job descriptions, and practice mock interviews —
          all powered by AI to help students and job seekers grow faster.
        </p>

        {/* GOOGLE LOGIN BUTTON */}
        <button
          onClick={handleGoogleLogin}
          className="
            mt-10 px-10 py-4 sm:px-12 sm:py-5 
            bg-indigo-600 text-white text-xl sm:text-2xl
            rounded-2xl shadow-lg hover:shadow-2xl 
            hover:bg-indigo-700 transition
          "
        >
          Get Started
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
      <section id="faq" className="px-6 py-28 fade-center reveal">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-14">FAQ</h2>

        <FAQ q="Is this really free?" a="Yes — fully free for students and educational use." />
        <FAQ q="Do I need technical knowledge?" a="No. Just upload your resume or paste a JD." />
        <FAQ q="Is my data safe & private?" a="Absolutely — nothing is stored without permission, and your files remain secure." />
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-gray-700 text-lg">
        Built with ❤️ for Students • Powered by MERN + AI
      </footer>
    </div>
  );
}

/* FEATURE SECTION --------------------------------------------------- */

function PremiumSection({ title, subtitle, desc, img, reverse }) {
  return (
    <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        
        {/* TEXT */}
        <div className={`${reverse ? "lg:order-2 fade-right" : "lg:order-1 fade-left"} reveal`}>
          <h3 className="text-indigo-600 text-xl md:text-2xl font-semibold mb-4">{subtitle}</h3>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">{title}</h2>
          <p className="text-gray-600 text-lg md:text-2xl leading-relaxed">{desc}</p>
        </div>

        {/* IMAGE */}
        <div
          className={`
            relative premium-img-wrapper
            w-full h-[320px] md:h-[420px]
            rounded-3xl overflow-hidden
            bg-white border border-gray-200 shadow-xl
            transition-all duration-500
            hover:scale-[1.04] hover:shadow-2xl hover:brightness-[1.05]
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

/* FAQ --------------------------------------------------------------- */

function FAQ({ q, a }) {
  return (
    <details
      className="
        max-w-4xl mx-auto mb-6 p-6 md:p-7
        border rounded-2xl bg-white shadow-md
        hover:shadow-xl transition-all
        fade-center reveal
      "
    >
      <summary className="cursor-pointer font-semibold text-xl md:text-2xl">
        {q}
      </summary>
      <p className="mt-4 text-gray-600 text-lg md:text-xl">{a}</p>
    </details>
  );
}
