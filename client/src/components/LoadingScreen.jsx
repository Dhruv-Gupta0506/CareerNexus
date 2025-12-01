import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen({ fullscreen = true }) {
  const [message, setMessage] = useState("Preparing your workspace...");
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);

  useEffect(() => {
    // 1. Initial "friendly" delay
    const timer1 = setTimeout(() => {
      setMessage("Almost there...");
    }, 2000);

    // 2. Server Cold Start Logic (The "Render" delay)
    const timer2 = setTimeout(() => {
      setShowLongWaitMessage(true);
      setMessage("Waking up the server...");
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Base classes for the container
  const containerBase = "flex flex-col items-center justify-center overflow-hidden transition-all duration-500";
  
  // Fullscreen vs Component styles
  const containerStyle = fullscreen 
    ? `fixed inset-0 z-[999] bg-[#f8f9ff] ${containerBase}`
    : `w-full h-64 ${containerBase}`;

  return (
    <div className={containerStyle}>
      
      {/* --- BACKGROUND DECORATION (Only for fullscreen) --- */}
      {fullscreen && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-300/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-300/20 blur-[120px] pointer-events-none" />
        </>
      )}

      {/* --- CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* LOGO / SPINNER WRAPPER */}
        <div className="relative mb-8">
          {/* Glowing blur behind the spinner */}
          <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full transform scale-150 animate-pulse"></div>
          
          {/* The Spinning Icon */}
          <Loader2 className="relative z-10 w-16 h-16 text-indigo-600 animate-spin drop-shadow-sm" />
        </div>

        {/* BRAND TITLE */}
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent mb-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
          Zyris
        </h1>

        {/* STATUS MESSAGE */}
        <p className="text-gray-500 font-medium text-lg animate-pulse transition-all duration-300">
          {message}
        </p>

        {/* EXTRA HELP TEXT (If server is cold starting) */}
        <div className={`mt-4 overflow-hidden transition-all duration-700 ${showLongWaitMessage ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-sm text-gray-400 bg-white/50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            Server is warming up, this may take up to 60s.
          </p>
        </div>

      </div>
    </div>
  );
}