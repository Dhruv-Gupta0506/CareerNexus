// frontend/pages/JDHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Trash2, 
  Calendar, 
  Target, 
  ChevronDown, 
  ArrowLeft, 
  Loader2,
  Briefcase,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  ListChecks,
  Lightbulb
} from "lucide-react";

// Define API_URL directly to avoid import errors
const API_URL = "http://localhost:5000/api";

export default function JDHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  
  const navigate = useNavigate();

  // --- FETCH HISTORY ---
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/jd/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // --- TOGGLE EXPAND ---
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --- DELETE HANDLER (Connected to Backend) ---
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent toggling expansion
    
    if (!window.confirm("Are you sure you want to delete this JD analysis? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      
      // Call Backend to delete from Database
      await axios.delete(`${API_URL}/jd/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI state to remove the item immediately
      setHistory((prev) => prev.filter((item) => item._id !== id));
      
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.message || "Failed to delete record.");
    }
  };

  // --- SORTING LOGIC ---
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (sortConfig.key === 'matchScore') {
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;
      return sortConfig.direction === 'asc' ? scoreA - scoreB : scoreB - scoreA;
    }
    // Default: Date
    return sortConfig.direction === 'asc' 
      ? new Date(a.createdAt) - new Date(b.createdAt) 
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  // --- HELPERS ---
  const safeNum = (n) => (typeof n === "number" ? n : 0);
  const safeArr = (a) => (Array.isArray(a) && a.length ? a : []);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative w-full min-h-screen text-[#111827] overflow-hidden pt-36 pb-20 px-4 sm:px-6">
      
      {/* ========================================================= */}
      {/* 1. BACKGROUND THEME */}
      {/* ========================================================= */}
      <div className="fixed inset-0 -z-30 bg-gradient-to-br from-[#f7f8ff] via-[#eef0ff] to-[#e7e9ff]" />
      <div className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle,rgba(150,115,255,0.15),transparent_70%)] blur-[120px] -z-20 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-full h-28 bg-gradient-to-b from-transparent to-[#f7f8ff] pointer-events-none z-10"></div>

      <div className="max-w-5xl mx-auto relative z-20">
        
        {/* HEADER */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#34245f] tracking-tight mb-4">
            JD Analysis <span className="bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-transparent bg-clip-text">History</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Review your past job description breakdowns, match scores, and tailoring advice.
          </p>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
             <Filter className="w-4 h-4" />
             <span className="text-sm">Sort By:</span>
          </div>
          
          <div className="flex gap-3">
             <button 
                onClick={() => handleSort('createdAt')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${sortConfig.key === 'createdAt' ? 'bg-indigo-100 text-indigo-700' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
             >
                <Calendar className="w-4 h-4" /> Date
                {sortConfig.key === 'createdAt' && <ArrowUpDown className="w-3 h-3 opacity-50" />}
             </button>
             
             <button 
                onClick={() => handleSort('matchScore')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${sortConfig.key === 'matchScore' ? 'bg-indigo-100 text-indigo-700' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
             >
                <Target className="w-4 h-4" /> Match
                {sortConfig.key === 'matchScore' && <ArrowUpDown className="w-3 h-3 opacity-50" />}
             </button>
          </div>
        </div>

        {/* LIST SECTION */}
        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[2rem] border border-white/60">
             <p className="text-gray-500 text-lg">No JD analysis history found.</p>
             <button onClick={() => navigate("/jd")} className="mt-4 text-indigo-600 font-bold hover:underline">
                Analyze your first Job Description
             </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {sortedHistory.map((record) => {
               const isExpanded = expanded[record._id];
               const score = safeNum(record.matchScore);
               // Color logic for match score
               let scoreColor = "text-rose-500";
               let scoreBg = "bg-rose-50";
               if (score >= 70) { scoreColor = "text-emerald-500"; scoreBg = "bg-emerald-50"; }
               else if (score >= 40) { scoreColor = "text-amber-500"; scoreBg = "bg-amber-50"; }

               return (
                  <div 
                    key={record._id} 
                    className={`bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-sm overflow-hidden transition-all duration-500 ${isExpanded ? 'ring-2 ring-indigo-100 shadow-md' : 'hover:shadow-md'}`}
                  >
                     {/* SUMMARY HEADER (Always Visible) */}
                     <div 
                        onClick={() => toggleExpand(record._id)}
                        className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                     >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                              <Briefcase className="w-6 h-6" />
                           </div>
                           <div className="min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 truncate">{record.jobTitle || "Untitled Role"}</h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                                 <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {record.fitVerdict || "Analysis"}</span>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                 <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(record.createdAt)}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                           <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${scoreBg} ${scoreColor}`}>
                              <Target className="w-5 h-5" />
                              <span>{score}% Match</span>
                           </div>
                           
                           <div className="flex items-center gap-2">
                              <button 
                                 onClick={(e) => handleDelete(e, record._id)}
                                 className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                                 title="Delete Analysis"
                              >
                                 <Trash2 className="w-5 h-5" />
                              </button>
                              <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-gray-100' : ''}`}>
                                 <ChevronDown className="w-5 h-5 text-gray-400" />
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* EXPANDED CONTENT (Replicating JDAnalyzer.jsx UI) */}
                     {isExpanded && (
                        <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50/30 animate-in slide-in-from-top-2 duration-300">
                           
                           {/* 0. ORIGINAL JD CONTEXT */}
                           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                 <FileText className="text-indigo-500 w-5 h-5" /> Original Job Description
                              </h4>
                              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-64 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-medium scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                 {record.jobDescription || "No job description text recorded."}
                              </div>
                           </div>

                           {/* 1. OVERVIEW CARDS */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                              {/* Job Title Card */}
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <Target className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Target Role</p>
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                       {record.jobTitle || "Specified Role"}
                                    </h3>
                                 </div>
                              </div>

                              {/* Match Score Card */}
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                                 <div className="relative z-10">
                                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-1">Match Potential</p>
                                    <p className="text-3xl font-extrabold text-indigo-900">
                                       {record.matchScore ?? "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">{record.fitVerdict ?? "N/A"}</p>
                                 </div>
                                 <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-100 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none"></div>
                              </div>
                           </div>

                           {/* 2. SCORE BREAKDOWN */}
                           {record.scoreBreakdown && (
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                                 <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="text-indigo-500 w-5 h-5" /> Score Breakdown
                                 </h4>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.entries(record.scoreBreakdown).map(([key, value]) => {
                                       const numVal = typeof value === 'number' ? value : 0;
                                       const isOutOf100 = numVal > 10;
                                       const max = isOutOf100 ? 100 : 10;
                                       const percentage = (numVal / max) * 100;
                                       
                                       let barColor = "bg-rose-500";
                                       if (percentage >= 70) barColor = "bg-emerald-500";
                                       else if (percentage >= 40) barColor = "bg-amber-500";

                                       return (
                                          <div key={key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                             <div className="flex justify-between items-end mb-2">
                                                <p className="text-gray-500 text-xs font-semibold capitalize">
                                                   {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </p>
                                                <p className="text-base font-bold text-gray-900">
                                                   {numVal}<span className="text-gray-400 text-xs">/{max}</span>
                                                </p>
                                             </div>
                                             <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                <div 
                                                   className={`h-1.5 rounded-full ${barColor}`} 
                                                   style={{ width: `${percentage}%` }}
                                                ></div>
                                             </div>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           )}

                           {/* 3. REQUIREMENTS GRID */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                              {/* Explicit Requirements */}
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                 <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ListChecks className="text-indigo-500 w-5 h-5" /> Explicit Requirements
                                 </h4>
                                 <ul className="space-y-3">
                                    {safeArr(record.explicitRequirements).map((req, i) => (
                                       <li key={i} className="flex gap-3 text-gray-700 bg-gray-50 p-3 rounded-xl">
                                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span>
                                          <span className="text-sm leading-relaxed">{req}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>

                              {/* Implicit Requirements */}
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                 <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Lightbulb className="text-amber-500 w-5 h-5" /> Implicit Expectations
                                 </h4>
                                 <ul className="space-y-3">
                                    {safeArr(record.implicitRequirements).map((req, i) => (
                                       <li key={i} className="flex gap-3 text-gray-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></span>
                                          <span className="text-sm leading-relaxed">{req}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>

                           {/* 4. STRENGTHS & WEAKNESSES */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
                                 <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="text-emerald-500 w-5 h-5" /> Top Strengths
                                 </h4>
                                 <ul className="space-y-2">
                                    {safeArr(record.strengthsBasedOnJD).map((s, i) => (
                                       <li key={i} className="flex items-center gap-2 text-gray-700">
                                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {s}
                                       </li>
                                    ))}
                                 </ul>
                              </div>

                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100">
                                 <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="text-rose-500 w-5 h-5" /> Missing Skills
                                 </h4>
                                 <div className="flex flex-wrap gap-2">
                                    {safeArr(record.missingSkills).map((s, i) => (
                                       <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium border border-rose-100">
                                          {s}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           {/* 5. KEYWORDS & TIPS */}
                           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                              
                              <div>
                                 <h4 className="text-lg font-bold text-gray-900 mb-4">Recommended Keywords</h4>
                                 <div className="flex flex-wrap gap-2">
                                    {safeArr(record.recommendedKeywords).map((k, i) => (
                                       <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                                          {k}
                                       </span>
                                    ))}
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                                 <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-3">Improvement Tips</h4>
                                    <ul className="space-y-3">
                                       {safeArr(record.improvementTips).map((tip, i) => (
                                          <li key={i} className="flex gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                                             <span className="font-bold text-indigo-400">{i+1}.</span> {tip}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 
                                 <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-3">Tailored Bullet Suggestions</h4>
                                    <ul className="space-y-3">
                                       {safeArr(record.tailoredBulletSuggestions).map((bullet, i) => (
                                          <li key={i} className="flex gap-3 text-sm text-gray-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
                                             <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></span> {bullet}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           </div>

                        </div>
                     )}
                  </div>
               );
            })}
          </div>
        )}

        {/* BACK TO DASHBOARD BUTTON */}
        <div className="mt-16 mb-8 max-w-2xl mx-auto">
          <button
            onClick={() => { window.scrollTo(0, 0); navigate("/dashboard"); }}
            className="w-full py-4 rounded-xl font-bold text-lg text-white shadow-[0_4px_20px_rgba(120,50,255,0.2)] bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:scale-[1.01] hover:shadow-[0_6px_30px_rgba(120,50,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}