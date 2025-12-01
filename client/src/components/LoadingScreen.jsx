import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen({ fullscreen = true }) {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // If loading takes longer than 3 seconds, assume Server is sleeping (Cold Start)
    const timer = setTimeout(() => {
      setMessage("Waking up the server... (this may take a minute)");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // CSS classes based on whether we want full screen or just a section
  const containerClass = fullscreen 
    ? "fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    : "w-full h-64 flex flex-col items-center justify-center";

  return (
    <div className={containerClass}>
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-lg font-bold text-gray-700 animate-pulse">{message}</p>
      {message.includes("Waking") && (
        <p className="text-sm text-gray-500 mt-2">Thank you for your patience!</p>
      )}
    </div>
  );
}