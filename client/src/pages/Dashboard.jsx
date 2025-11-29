import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Target,
  Mic,
  Search,
  Pencil,
  BookOpen,
  File,
  Headphones,
  BarChart3,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

/* ==================================================================================
   1. FLOATING BACKGROUND COMPONENT (High Visibility Version)
   ================================================================================== */
const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

const FloatingBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle High DPI displays
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);

    const shapes = [];
    
    // Light theme configuration
    const createShape = () => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 100,
      size: Math.random() * 120 + 30, // Slightly larger range
      // ✅ INCREASED OPACITY: Now ranges from 0.10 to 0.35 (was 0.05 to 0.20)
      opacity: Math.random() * 0.25 + 0.10, 
      speed: Math.random() * 1.5 + 0.4,
      borderRadius: 0,
      borderRadiusChange: Math.random() * 0.05 + 0.02,
    });

    // Initialize shapes
    const init = () => {
      shapes.length = 0;
      // ✅ INCREASED DENSITY: 
      // Mobile: 15 shapes (was 8)
      // Desktop: 40 shapes (was 15)
      const max = window.innerWidth <= 768 ? 10 : 20; 
      for (let i = 0; i < max; i++) shapes.push(createShape());
    };
    init();

    let rotationAngle = 0;

    const draw = () => {
      // 1. Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Light Gradient Background
      const g = ctx.createLinearGradient(0, 0, 0, window.innerHeight); 
      g.addColorStop(0, "#f8f9ff"); // Very light top
      g.addColorStop(1, "#eef2ff"); // Slightly darker indigo bottom
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // 3. Draw Shapes
      shapes.forEach((s, i) => {
        s.y -= s.speed;
        s.borderRadius = Math.min(s.size / 2, s.borderRadius + s.borderRadiusChange);
        
        // Fade out near top
        const fade = Math.max(0, s.y / window.innerHeight);
        
        if (s.y < -s.size) shapes[i] = createShape(); // Respawn

        rotationAngle += 0.0002;

        ctx.save();
        ctx.translate(s.x + s.size / 2, s.y + s.size / 2);
        ctx.rotate(rotationAngle + i * 0.1); // Add index variation to rotation
        ctx.translate(-s.x - s.size / 2, -s.y - s.size / 2);
        
        // Color: Indigo-500 with adjusted opacity
        ctx.fillStyle = `rgba(99, 102, 241, ${s.opacity * fade})`; 
        
        ctx.beginPath();
        // Squircle / Soft shape logic
        ctx.moveTo(s.x + s.size / 2, s.y);
        ctx.arcTo(s.x + s.size, s.y, s.x + s.size, s.y + s.size, s.borderRadius);
        ctx.arcTo(s.x + s.size, s.y + s.size, s.x, s.y + s.size, s.borderRadius);
        ctx.arcTo(s.x, s.y + s.size, s.x, s.y, s.borderRadius);
        ctx.arcTo(s.x, s.y, s.x + s.size, s.y, s.borderRadius);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

/* ==================================================================================
   2. MAIN DASHBOARD COMPONENT
   ================================================================================== */
export default function Dashboard() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          return null;
        }
        return res.json();
      })
      .then((data) => data && setUser(data))
      .catch((err) => console.error("FETCH USER ERROR:", err));
  }, [token]);

  const features = [
    {
      title: "Resume Analyzer",
      desc: "Upload your resume and get deep AI insights.",
      icon: FileText,
      path: "/resume",
      color: "from-indigo-500 to-purple-500",
      shadow: "shadow-indigo-500/25",
    },
    {
      title: "JD Analyzer",
      desc: "Compare your resume with job descriptions.",
      icon: Target,
      path: "/jd",
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/25",
    },
    {
      title: "Mock Interview",
      desc: "Practice interviews with AI-powered feedback.",
      icon: Mic,
      path: "/interview",
      color: "from-pink-500 to-rose-500",
      shadow: "shadow-pink-500/25",
    },
    {
      title: "Match Engine",
      desc: "Calculate match % and missing skills.",
      icon: Search,
      path: "/match-engine",
      color: "from-indigo-500 to-blue-500",
      shadow: "shadow-blue-500/25",
    },
    {
      title: "Tailored Resume",
      desc: "Generate ATS-optimized resumes instantly.",
      icon: Pencil,
      path: "/tailored-resume",
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-cyan-500/25",
    },
  ];

  const history = [
    { title: "Resume History", icon: BookOpen, path: "/history" },
    { title: "JD History", icon: File, path: "/jd-history" },
    { title: "Interview History", icon: Headphones, path: "/interview-history" },
    { title: "Match History", icon: BarChart3, path: "/match-history" },
    { title: "Tailored History", icon: FolderOpen, path: "/tailored-history" },
  ];

  return (
    <div className="relative min-h-screen pt-36 pb-20 px-4 sm:px-8">
      
      {/* ✅ FLOATING ANIMATED BACKGROUND */}
      <FloatingBackground />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="mb-16 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {user ? user.name.split(" ")[0] : "User"}
            </span>
          </h1>
          <p className="text-gray-900 mt-4 text-lg sm:text-xl max-w-2xl">
            Your AI-powered career command center. What would you like to achieve today?
          </p>
        </div>

        {/* TOOLS SECTION */}
        <SectionHeading>Career Tools</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(card.path)}
                className="
                  group relative p-8 rounded-[2rem] cursor-pointer select-none
                  bg-white/60 backdrop-blur-xl border border-white/50
                  shadow-sm
                  
                  /* Desktop Hover Only (sm:hover) */
                  sm:hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                  sm:hover:border-indigo-200
                  sm:hover:-translate-y-2
                  
                  transition-all duration-300 ease-out
                "
              >
                {/* Icon Box */}
                <div
                  className={`
                    w-16 h-16 flex items-center justify-center
                    rounded-2xl mb-6
                    bg-gradient-to-br ${card.color}
                    shadow-lg ${card.shadow}
                    
                    /* Desktop Hover Animation */
                    sm:group-hover:scale-110 
                    sm:group-hover:rotate-3
                    transition-all duration-300
                  `}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 sm:group-hover:text-indigo-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px] font-medium">
                  {card.desc}
                </p>

                {/* Decorative Arrow (Only visible on Desktop Hover) */}
                <div className="absolute top-8 right-8 opacity-0 -translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-300 text-gray-400">
                    <ChevronRight />
                </div>
              </div>
            );
          })}
        </div>

        {/* HISTORY SECTION (Upgraded styling) */}
        <SectionHeading>Recent Activity & History</SectionHeading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(card.path)}
                className="
                  group flex items-center p-5 rounded-2xl cursor-pointer select-none
                  bg-white/60 backdrop-blur-lg border border-white/60
                  shadow-sm 
                  
                  /* Desktop Hover Only */
                  sm:hover:shadow-md
                  sm:hover:bg-white/80
                  sm:hover:border-indigo-200
                  sm:hover:scale-[1.02]
                  
                  transition-all duration-300
                "
              >
                <div
                  className="
                    w-12 h-12 flex items-center justify-center
                    rounded-xl mr-5
                    bg-indigo-50 text-indigo-600
                    
                    /* Desktop Hover */
                    sm:group-hover:bg-indigo-600 
                    sm:group-hover:text-white
                    transition-all duration-300
                  "
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 sm:group-hover:text-indigo-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">View records</p>
                </div>
                
                {/* Arrow Icon */}
                <div className="ml-auto text-gray-300 sm:group-hover:text-indigo-400 sm:group-hover:translate-x-1 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* SHARED HEADING COMPONENT */
function SectionHeading({ children }) {
  return (
    <div className="mb-10 relative">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 inline-block relative z-10">
        {children}
      </h2>
      <div className="absolute bottom-1 left-0 w-1/3 h-3 bg-indigo-200/60 -z-10 -rotate-1 rounded-full blur-[2px]"></div>
    </div>
  );
}