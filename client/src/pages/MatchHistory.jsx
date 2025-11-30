// frontend/pages/MatchHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Trash2, 
  Calendar, 
  Target, 
  ChevronDown, 
  ArrowLeft, 
  Loader2,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Filter,
  Users,
  XCircle,
  TrendingUp,
  FileText
} from "lucide-react";

// Define API_URL directly to avoid import errors
const API_URL = import.meta.env.VITE_API_URL;

export default function MatchHistory() {
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
        const res = await axios.get(`${API_URL}/match/history`, {
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
    
    if (!window.confirm("Are you sure you want to delete this match record? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      
      // Call Backend to delete from Database
      await axios.delete(`${API_URL}/match/history/${id}`, {
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
    if (sortConfig.key === 'overallScore') {
      const scoreA = a.overallScore || 0;
      const scoreB = b.overallScore || 0;
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
            Match Engine <span className="bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-transparent bg-clip-text">History</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Review past compatibility checks between your resumes and job descriptions.
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
                onClick={() => handleSort('overallScore')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${sortConfig.key === 'overallScore' ? 'bg-indigo-100 text-indigo-700' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
             >
                <Target className="w-4 h-4" /> Score
                {sortConfig.key === 'overallScore' && <ArrowUpDown className="w-3 h-3 opacity-50" />}
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
             <p className="text-gray-500 text-lg">No match history found.</p>
             <button onClick={() => navigate("/match")} className="mt-4 text-indigo-600 font-bold hover:underline">
                Run your first Match Analysis
             </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {sortedHistory.map((record) => {
               const isExpanded = expanded[record._id];
               const score = safeNum(record.overallScore);
               // Color logic for score
               let scoreColor = "text-rose-500";
               let scoreBg = "bg-rose-50";
               if (score >= 75) { scoreColor = "text-emerald-500"; scoreBg = "bg-emerald-50"; }
               else if (score >= 50) { scoreColor = "text-amber-500"; scoreBg = "bg-amber-50"; }

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
                              <Search className="w-6 h-6" />
                           </div>
                           <div className="min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 truncate">{record.jobTitle || "Untitled Job"}</h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                                 <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {record.resumeFileName}</span>
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

                     {/* EXPANDED CONTENT (Replicating MatchEngine.jsx UI) */}
                     {isExpanded && (
                        <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50/30 animate-in slide-in-from-top-2 duration-300">
                           
                           {/* 1. MATCH SUMMARY CARDS */}
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                              {/* Verdict */}
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center relative overflow-hidden">
                                 <div className="relative z-10">
                                    <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Overall Fit</p>
                                    <span className={`text-4xl font-extrabold tracking-tighter ${scoreColor}`}>
                                       {score}%
                                    </span>
                                    <span className="block mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                       {record.verdict || "N/A"}
                                    </span>
                                 </div>
                              </div>

                              {/* Hiring Probability */}
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                                 <p className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Hiring Probability</p>
                                 <span className="text-4xl font-extrabold tracking-tighter text-fuchsia-600">
                                    {safeNum(record.hiringProbability)}%
                                 </span>
                                 <span className="block mt-2 px-3 py-1 bg-fuchsia-50 text-fuchsia-700 rounded-full text-xs font-semibold">
                                    AI Estimation
                                 </span>
                              </div>

                              {/* Context Card */}
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center lg:col-span-1 md:col-span-2">
                                 <div className="space-y-3">
                                    <div>
                                       <p className="text-xs font-bold text-gray-400 uppercase">Target Role</p>
                                       <p className="font-bold text-gray-800 truncate">{record.jobTitle || "Not specified"}</p>
                                    </div>
                                    <div>
                                       <p className="text-xs font-bold text-gray-400 uppercase">Category</p>
                                       <p className="font-medium text-indigo-600 text-sm">{record.roleCategory || "General"}</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* 2. COMPETENCY MATRIX */}
                           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                 <BarChart3 className="text-indigo-500 w-5 h-5" /> Competency Matrix
                              </h3>
                              <div className="space-y-4">
                                 {safeArr(record.competencies).map((c, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                                       <div className="sm:w-1/3 w-full font-semibold text-gray-800 text-sm">{c.name}</div>
                                       
                                       <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                          {/* Resume Level */}
                                          <div>
                                             <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>You: {safeNum(c.resumeLevel)}/10</span>
                                             </div>
                                             <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(safeNum(c.resumeLevel) / 10) * 100}%` }}></div>
                                             </div>
                                          </div>
                                          {/* JD Level */}
                                          <div>
                                             <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Req: {safeNum(c.jdLevel)}/10</span>
                                             </div>
                                             <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: `${(safeNum(c.jdLevel) / 10) * 100}%` }}></div>
                                             </div>
                                          </div>
                                       </div>

                                       <div className={`sm:w-20 w-full text-center text-xs font-bold ${safeNum(c.gap) > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                                          {safeNum(c.gap) > 0 ? `-${c.gap} Gap` : "✓ Match"}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* 3. STRENGTHS & WEAKNESSES */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100">
                                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="text-emerald-500 w-5 h-5" /> Your Strengths
                                 </h3>
                                 <ul className="space-y-2">
                                    {safeArr(record.strengths).map((s, i) => (
                                       <li key={i} className="flex gap-2 text-sm text-gray-600">
                                          <span className="text-emerald-500 font-bold">•</span> {s}
                                       </li>
                                    ))}
                                 </ul>
                              </div>

                              <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100">
                                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="text-rose-500 w-5 h-5" /> Critical Gaps
                                 </h3>
                                 <ul className="space-y-2">
                                    {safeArr(record.weaknesses).map((s, i) => (
                                       <li key={i} className="flex gap-2 text-sm text-gray-600">
                                          <span className="text-rose-500 font-bold">•</span> {s}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           </div>

                           {/* 4. RECRUITER INSIGHTS */}
                           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                 <Users className="text-indigo-500 w-5 h-5" /> Recruiter's Perspective
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div>
                                    <p className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Likely Objections</p>
                                    <ul className="space-y-2">
                                       {safeArr(record.recruiterObjections).map((obj, i) => (
                                          <li key={i} className="text-sm text-gray-600 bg-rose-50 p-2 rounded-lg border-l-4 border-rose-400">
                                             {obj}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                                 <div>
                                    <p className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Why They Might Hire You</p>
                                    <ul className="space-y-2">
                                       {safeArr(record.recruiterStrengths).map((str, i) => (
                                          <li key={i} className="text-sm text-gray-600 bg-emerald-50 p-2 rounded-lg border-l-4 border-emerald-400">
                                             {str}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </div>
                           </div>

                           {/* 5. SKILLS & BOOST */}
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                       <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                          <Target className="w-4 h-4 text-emerald-500" /> Matching Skills
                                       </h4>
                                       <div className="flex flex-wrap gap-2">
                                          {safeArr(record.matchingSkills).map((s, i) => (
                                             <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-bold border border-emerald-100">
                                                {s}
                                             </span>
                                          ))}
                                       </div>
                                    </div>
                                    <div>
                                       <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                          <XCircle className="w-4 h-4 text-rose-500" /> Missing Skills
                                       </h4>
                                       <div className="flex flex-wrap gap-2">
                                          {safeArr(record.missingSkills).map((s, i) => (
                                             <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs font-bold border border-rose-100">
                                                {s}
                                             </span>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-500/30 text-white flex flex-col justify-center relative overflow-hidden">
                                 <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 opacity-90">
                                       <TrendingUp className="w-5 h-5" />
                                       <span className="font-bold uppercase text-xs tracking-wider">Score Boost</span>
                                    </div>
                                    <p className="text-sm leading-relaxed opacity-95 font-medium">
                                       {record.scoreBoostEstimate}
                                    </p>
                                 </div>
                                 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
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