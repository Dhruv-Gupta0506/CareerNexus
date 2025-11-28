import { useEffect, useState } from "react";
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
} from "lucide-react";

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
      path: "/resume-analyzer",
    },
    {
      title: "JD Analyzer",
      desc: "Compare your resume with job descriptions.",
      icon: Target,
      path: "/jd-analyzer",
    },
    {
      title: "Mock Interview",
      desc: "Practice interviews with AI-powered feedback.",
      icon: Mic,
      path: "/mock-interview",
    },
    {
      title: "Match Engine",
      desc: "Calculate match % and missing skills.",
      icon: Search,
      path: "/match-engine",
    },
    {
      title: "Tailored Resume",
      desc: "Generate ATS-optimized resumes instantly.",
      icon: Pencil,
      path: "/tailored-resume",
    },
  ];

  const history = [
    { title: "Resume History", icon: BookOpen, path: "/resume-history" },
    { title: "JD History", icon: File, path: "/jd-history" },
    { title: "Interview History", icon: Headphones, path: "/interview-history" },
    { title: "Match History", icon: BarChart3, path: "/match-history" },
    { title: "Tailored Resume History", icon: FolderOpen, path: "/tailored-history" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-8 bg-gradient-to-br from-[#f7f8ff] via-[#eef0ff] to-[#e7e9ff]">
      <div className="max-w-6xl mx-auto">

        {/* HEADER SECTION */}
        <div className="mb-14">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
            Welcome{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Your AI-powered career tools, all in one place.
          </p>
        </div>

        {/* FEATURE TOOLS */}
        <h2 className="section-heading">Tools</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(card.path)}
                className="
                  group p-7 rounded-3xl cursor-pointer select-none
                  bg-white/55 backdrop-blur-xl border border-white/40
                  shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]
                  hover:scale-[1.035]
                  active:scale-[0.98]
                  transition-all duration-300 ease-out
                "
              >
                <div
                  className="
                    w-14 h-14 flex items-center justify-center
                    rounded-2xl mb-5
                    bg-gradient-to-br from-indigo-500/20 to-purple-500/20
                    group-hover:from-indigo-500/30 group-hover:to-purple-500/30
                    transition-all
                  "
                >
                  <Icon className="w-7 h-7 text-indigo-700" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* HISTORY */}
        <h2 className="section-heading">History</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(card.path)}
                className="
                  group p-7 rounded-3xl cursor-pointer select-none
                  bg-white/55 backdrop-blur-xl border border-white/40
                  shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)]
                  hover:scale-[1.035]
                  active:scale-[0.98]
                  transition-all duration-300 ease-out
                "
              >
                <div
                  className="
                    w-14 h-14 flex items-center justify-center
                    rounded-2xl mb-5
                    bg-gradient-to-br from-blue-500/20 to-cyan-500/20
                    group-hover:from-blue-500/30 group-hover:to-cyan-500/30
                    transition-all
                  "
                >
                  <Icon className="w-7 h-7 text-blue-700" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {card.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* SHARED HEADING STYLE */
function SectionHeading({ children }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-9 text-gray-900">
      {children}
    </h2>
  );
}
