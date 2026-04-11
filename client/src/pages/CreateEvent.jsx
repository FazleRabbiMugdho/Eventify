import React, { useState, useContext, useRef, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import {
  UploadCloud, CalendarDays, Clock3,
  LayoutDashboard, Calendar, PlusSquare, TrendingUp,
  MapPin, DollarSign, Type, AlignLeft, PartyPopper, X,
  Bell, User, Sparkles, Wand2,
} from "lucide-react";
import { AnimationStyles, FadeIn, SlideIn, usePageLoad, SkeletonCreateEvent } from "../components/ui";
import ApiClient from "../api";
import logoLight from '../assets/eventify-logo-light.png';
import logoDark from '../assets/eventify-logo-dark.png';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Music", "Tech", "Business", "Sports",
  "Art", "Food", "Wellness", "Comedy", "Workshop",
];

// ─── Logo SVG ─────────────────────────────────────────────────────────────────

function LogoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="22" height="19" rx="3.5" fill="white" fillOpacity="0.15" />
      <rect x="3" y="6" width="22" height="19" rx="3.5" stroke="white" strokeWidth="1.8" />
      <rect x="3" y="6" width="22" height="7" rx="3.5" fill="white" fillOpacity="0.25" />
      <rect x="3" y="9.5" width="22" height="3.5" fill="white" fillOpacity="0.25" />
      <line x1="9" y1="3" x2="9" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="19" y1="3" x2="19" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M14 14.5L15.2 17.2L18.2 17.5L16.1 19.4L16.7 22.3L14 20.8L11.3 22.3L11.9 19.4L9.8 17.5L12.8 17.2L14 14.5Z"
        fill="white" stroke="white" strokeWidth="0.5"
      />
    </svg>
  );
}

// ─── Input Wrapper ────────────────────────────────────────────────────────────
// FIXED: Moved outside CreateEvent so React doesn't remount inputs on every render

function InputWrapper({ children, label, icon, required, darkMode }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <label className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {icon && React.cloneElement(icon, { size: 13, className: "text-indigo-500" })}
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Venue Autocomplete (Nominatim / OpenStreetMap — free, no API key) ────────

function VenueAutocomplete({ value, onChange, inputClasses, darkMode }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    try {
      // Photon is faster and better for Typeahead
      // center lat/lon for Bangladesh to bias results
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lat=23.8103&lon=90.4125&bbox=88.0,20.5,92.7,26.6`
      );
      const data = await res.json();
      const formatted = data.features.map((f) => {
        const p = f.properties;
        const shortName = p.name || p.street || p.district;
        const cityInfo = [p.city, p.state].filter(Boolean).join(", ");
        return {
          id: f.properties.osm_id || Math.random(),
          display: [p.name, p.street, p.district, p.city, p.country].filter(Boolean).join(", "),
          short: cityInfo ? `${shortName}, ${cityInfo}` : shortName,
        };
      });
      setSuggestions(formatted);
      setShowDropdown(formatted.length > 0);
    } catch (err) {
      console.error("Photon fetch failed:", err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    // Debounce 400ms — Nominatim has a usage policy; don't spam it
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
  };

  const handleSelect = (suggestion) => {
    onChange(suggestion.short || suggestion.display);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          name="location"
          value={value}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder="Search venue or area in Bangladesh..."
          className={inputClasses}
          autoComplete="off"
          required
        />
        {/* Spinner while fetching */}
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul
          className={`
            absolute z-50 w-full mt-2 rounded-2xl border overflow-hidden shadow-2xl
            ${darkMode
              ? "bg-[#1E0B3B] border-white/10 shadow-black/40"
              : "bg-white border-slate-100 shadow-slate-200/80"
            }
          `}
        >
          {suggestions.map((s) => (
            <li
              key={s.id}
              onMouseDown={() => handleSelect(s)}
              className={`
                flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors
                ${darkMode
                  ? "hover:bg-indigo-600/20 border-b border-white/5 last:border-0"
                  : "hover:bg-indigo-50 border-b border-slate-50 last:border-0"
                }
              `}
            >
              <MapPin size={14} className="text-indigo-500 mt-1 shrink-0" />
              <div className="min-w-0">
                <p className={`text-sm font-bold truncate ${darkMode ? "text-white" : "text-slate-800"}`}>
                  {s.short || s.display}
                </p>
                <p className={`text-xs truncate mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {s.display}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────

function DesktopSidebar({ darkMode, navigate }) {
  return (
    <aside className={`hidden lg:flex w-72 border-r transition-all duration-500 flex-col sticky top-0 h-screen z-50 shrink-0 ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}`}>
      <div className="p-8">
        <img
          src={darkMode ? logoDark : logoLight}
          alt="Eventify"
          onClick={() => navigate('/')}
          className="w-48 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      </div>
      <nav className="flex-1 px-6 space-y-3 mt-8">
        <button onClick={() => navigate("/")} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}>
          <LayoutDashboard size={20} /> Explore
        </button>
        <button onClick={() => navigate("/my-events")} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}>
          <Calendar size={20} /> My Events
        </button>
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30">
          <PlusSquare size={20} /> Create Event
        </button>
      </nav>
    </aside>
  );
}

// ─── Tablet Sidebar ───────────────────────────────────────────────────────────

function TabletSidebar({ darkMode, navigate }) {
  return (
    <aside className={`hidden md:flex lg:hidden w-20 border-r transition-all duration-500 flex-col sticky top-0 h-screen z-50 shrink-0 items-center ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}`}>
      <div className="pt-6 pb-4 px-3">
        <img
          src={darkMode ? logoDark : logoLight}
          alt="Eventify"
          onClick={() => navigate('/')}
          className="w-12 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      </div>
      <div className={`w-8 h-px mb-4 ${darkMode ? "bg-white/10" : "bg-slate-100"}`} />
      <nav className="flex flex-col gap-3 px-3 flex-1">
        <button onClick={() => navigate("/")} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ripple-btn ${darkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50"}`}><LayoutDashboard size={20} /></button>
        <button onClick={() => navigate("/my-events")} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ripple-btn ${darkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50"}`}><Calendar size={20} /></button>
        <button className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all ripple-btn bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"><PlusSquare size={20} /></button>
      </nav>
    </aside>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({ darkMode, navigate, user }) {
  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 pt-3 pb-4 border-t backdrop-blur-xl ${darkMode ? "bg-[#0F0121]/95 border-white/5" : "bg-white/95 border-slate-100"}`}>
      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}><LayoutDashboard size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} /></div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Explore</span>
      </button>
      <button onClick={() => navigate("/my-events")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}><Calendar size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} /></div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Events</span>
      </button>
      <button className="flex flex-col items-center gap-1 px-3 py-1 -mt-6">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-600/40 border-4 border-white dark:border-[#0F0121]"><PlusSquare size={22} className="text-white" /></div>
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mt-1">Create</span>
      </button>
      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}><Bell size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} /></div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Alerts</span>
      </button>
      {user && (
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 px-3 py-1">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}><User size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} /></div>
          <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Profile</span>
        </button>
      )}
    </nav>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateEvent() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  // ── NOW ACTIVE: 500ms skeleton before content renders ──
  const loaded = usePageLoad(500);

  const [formData, setFormData] = useState({
    title: "", category: "", date: "",
    time: "", location: "", price: "", description: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [aiKeywords, setAiKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const userInitials = useMemo(() => {
    if (!user) return null;
    const name = user.user_name || user.fullName || "";
    const parts = name.trim().split(" ");
    const initials = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2);
    return initials.toUpperCase() || "?";
  }, [user]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Dedicated handler for the venue autocomplete
  const handleVenueChange = (value) => {
    setFormData((prev) => ({ ...prev, location: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) return alert("File is too large. Max 10MB.");
    setCoverImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setCoverImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMagicGenerate = async () => {
    if (!aiKeywords.trim()) return;
    setIsGenerating(true);
    try {
      const api = new ApiClient();
      const generatedData = await api.generateEvent(aiKeywords);
      if (generatedData) {
        setFormData((prev) => ({
          ...prev,
          title: generatedData.title || prev.title,
          description: generatedData.description || prev.description,
        }));
      }
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const required = ["title", "category", "date", "location", "description"];
    const missing = required.filter((f) => !formData[f]);
    if (missing.length > 0) {
      return alert("Please fill in all required fields (*).");
    }

    const start_date_time = `${formData.date} ${formData.time || "00:00:00"}`;

    try {
      const api = new ApiClient();
      const createdEvent = await api.createEvent(
        formData.title,
        formData.description,
        start_date_time,
        formData.location,
        formData.category,
        formData.price ? parseFloat(formData.price) : 0,
        imagePreview || null
      );

      if (createdEvent && createdEvent.success !== false) {
        alert("Event Published Successfully!");
        navigate("/");
      } else {
        alert("Event creation failed: the backend returned an empty response. Check console/logs.");
      }
    } catch (err) {
      alert("Error occurred while publishing event: " + err.message);
      console.error(err);
    }
  };

  // ── Shared input styles ────────────────────────────────────────────────────

  const inputClasses = `
    w-full px-5 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl outline-none font-bold text-sm sm:text-[15px]
    transition-all duration-300 border
    focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400
    ${darkMode
      ? "bg-[#1E0B3B] border-white/5 text-white placeholder:text-slate-600"
      : "bg-white border-slate-100 text-slate-900 placeholder:text-slate-400"
    }
  `;

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 font-sans ${darkMode ? "bg-[#0F0121] text-white" : "bg-[#F8FAFC] text-slate-900"}`}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); }
        .ripple-btn:after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10, 10); opacity: 0; transition: transform .5s, opacity 1s; }
        .ripple-btn:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }
        @supports (padding-bottom: env(safe-area-inset-bottom)) { .mobile-bottom-nav { padding-bottom: calc(0.5rem + env(safe-area-inset-bottom)); } }
      `}</style>
      <AnimationStyles />

      <DesktopSidebar darkMode={darkMode} navigate={navigate} />
      <TabletSidebar darkMode={darkMode} navigate={navigate} />

      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-5 sm:py-8 lg:py-10 relative overflow-y-auto pb-28 md:pb-10">

        {/* Header — always visible */}
        <FadeIn delay={0}>
          <header className="flex items-center justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                Create Event
              </h2>
              <p className={`font-bold mt-1 sm:mt-2 text-sm sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Fill in the details below to host your experience
              </p>
            </div>
            {user ? (
              <div onClick={() => navigate("/profile")} className="cursor-pointer group shrink-0">
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl ${user.profile_picture ? "" : "bg-indigo-600"} overflow-hidden flex items-center justify-center text-white text-sm sm:text-lg font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform`}>
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userInitials
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="shrink-0 px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
              >
                Log In
              </button>
            )}
          </header>
        </FadeIn>

        {/* Form area — skeleton or real content */}
        <div className="max-w-[1100px] mx-auto pb-10 sm:pb-32">
          {!loaded ? (
            <SkeletonCreateEvent darkMode={darkMode} />
          ) : (
            <>
              {/* AI Generator Box */}
              <FadeIn delay={40}>
                <div className={`mb-8 sm:mb-10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden border ${darkMode ? 'bg-gradient-to-br from-indigo-900 via-[#1E0B3B] to-[#0F0121] border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 border-indigo-100'}`}>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
                  <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0 border border-white/10">
                      <Sparkles className="text-white" size={24} />
                    </div>
                    <div className="flex-1 w-full space-y-3">
                      <div>
                        <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>AI Event Magic</h3>
                        <p className={`text-sm font-bold mt-1 ${darkMode ? 'text-indigo-200/70' : 'text-slate-500'}`}>
                          Enter a few keywords and let Gemini write a catchy title and description for you.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={aiKeywords}
                          onChange={(e) => setAiKeywords(e.target.value)}
                          placeholder="e.g., rock concert, Friday night, local bands..."
                          className={`flex-1 border rounded-xl px-4 py-3 outline-none transition-all font-bold text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-indigo-400 focus:bg-white/10' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-400'}`}
                        />
                        <button
                          type="button"
                          onClick={handleMagicGenerate}
                          disabled={isGenerating || !aiKeywords.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-indigo-600/20"
                        >
                          {isGenerating ? (
                            <span className="animate-pulse">Thinking...</span>
                          ) : (
                            <>Generate <Wand2 size={16} /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <form onSubmit={handlePublish} className="space-y-8 sm:space-y-16">

                {/* Cover image */}
                <FadeIn delay={80}>
                  <div className={`p-5 sm:p-10 rounded-[32px] sm:rounded-[48px] ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-50"}`}>
                    <InputWrapper label="Cover Image" icon={<PartyPopper />} required darkMode={darkMode}>
                      <div
                        onClick={() => fileInputRef.current.click()}
                        className={`
                          relative group h-[200px] sm:h-[300px] lg:h-[400px]
                          rounded-[24px] sm:rounded-[36px] border-4 border-dashed
                          transition-all cursor-pointer flex flex-col items-center
                          justify-center text-center p-6 sm:p-10 overflow-hidden
                          ${imagePreview
                            ? "border-indigo-500 shadow-xl shadow-indigo-500/10"
                            : darkMode
                              ? "border-white/10 hover:border-indigo-500 bg-[#0F0121]"
                              : "border-slate-100 hover:border-indigo-400 bg-slate-50"
                          }
                        `}
                      >
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0121]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-4 sm:top-6 right-4 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-rose-500 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl ripple-btn opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X size={18} strokeWidth={3} />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-8 shadow-2xl transition-colors ${darkMode ? "bg-[#1E0B3B]" : "bg-white"}`}>
                              <UploadCloud size={32} className="text-indigo-500 sm:hidden" strokeWidth={1.5} />
                              <UploadCloud size={44} className="text-indigo-500 hidden sm:block" strokeWidth={1.5} />
                            </div>
                            <h4 className="text-lg sm:text-2xl font-black tracking-tight mb-2">Upload cover image</h4>
                            <p className="text-sm font-bold text-slate-500">PNG, JPG up to 10MB</p>
                          </>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/png, image/jpeg"
                          className="hidden"
                        />
                      </div>
                    </InputWrapper>
                  </div>
                </FadeIn>

                {/* Core details */}
                <FadeIn delay={160}>
                  <div className={`p-5 sm:p-12 rounded-[32px] sm:rounded-[56px] ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-50"}`}>
                    <h3 className="text-xl sm:text-3xl font-black mb-8 sm:mb-12 tracking-tight flex items-center gap-3 sm:gap-4">
                      <AlignLeft size={20} className="text-indigo-500" /> Core Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">

                      {/* Title */}
                      <div className="sm:col-span-2">
                        <InputWrapper label="Event Title" icon={<Type />} required darkMode={darkMode}>
                          <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter a catchy event name" className={inputClasses} required />
                        </InputWrapper>
                      </div>

                      {/* Category */}
                      <InputWrapper label="Category" icon={<PartyPopper />} required darkMode={darkMode}>
                        <select name="category" value={formData.category} onChange={handleInputChange} className={`${inputClasses} appearance-none`} required>
                          <option value="" disabled>Select category</option>
                          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </InputWrapper>

                      {/* Venue — Nominatim autocomplete */}
                      <InputWrapper label="Venue" icon={<MapPin />} required darkMode={darkMode}>
                        <VenueAutocomplete
                          value={formData.location}
                          onChange={handleVenueChange}
                          inputClasses={inputClasses}
                          darkMode={darkMode}
                        />
                      </InputWrapper>

                      {/* Date */}
                      <InputWrapper label="Date" icon={<CalendarDays />} required darkMode={darkMode}>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputClasses} required />
                      </InputWrapper>

                      {/* Time */}
                      <InputWrapper label="Time" icon={<Clock3 />} darkMode={darkMode}>
                        <input type="time" name="time" value={formData.time} onChange={handleInputChange} className={inputClasses} />
                      </InputWrapper>

                      {/* Price — BDT */}
                      <InputWrapper label="Ticket Price (BDT)" icon={<DollarSign />} darkMode={darkMode}>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" min="0" step="0.01" className={inputClasses} />
                      </InputWrapper>

                      {/* Description */}
                      <div className="sm:col-span-2">
                        <InputWrapper label="Event Description" required darkMode={darkMode}>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your experience..."
                            rows={5}
                            className={`${inputClasses} py-4 sm:py-6 resize-none no-scrollbar`}
                            required
                          />
                        </InputWrapper>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mt-10 sm:mt-16 pt-8 sm:pt-10 border-t ${darkMode ? "border-white/5" : "border-slate-100"}`}>
                      <button
                        type="button"
                        onClick={() => navigate("/")}
                        className={`
                          flex-1 text-center py-4 sm:py-6 rounded-[22px] sm:rounded-[28px]
                          font-black text-base sm:text-lg transition-all ripple-btn
                          ${darkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-slate-50 text-slate-600 border border-slate-100"}
                        `}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 text-center py-4 sm:py-6 rounded-[22px] sm:rounded-[28px] bg-indigo-600 text-white font-black text-base sm:text-lg shadow-2xl shadow-indigo-600/20 ripple-btn hover:bg-indigo-700 transition-all"
                      >
                        Publish Event
                      </button>
                    </div>
                  </div>
                </FadeIn>

              </form>
            </>
          )}
        </div>
      </main>

      <MobileBottomNav darkMode={darkMode} navigate={navigate} user={user} />
    </div>
  );
}