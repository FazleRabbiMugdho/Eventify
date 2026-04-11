import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, PlusSquare, User, LogIn } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function MobileBottomNav() {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <nav className={`
      md:hidden fixed bottom-0 left-0 right-0 z-[100]
      flex items-end justify-around px-2 pt-2 border-t backdrop-blur-2xl
      ${darkMode ? "bg-[#0F0121]/95 border-white/5" : "bg-white/95 border-slate-100"}
    `}
    style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
      
      {/* Explore */}
      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1.5 w-16 group outline-none">
        <div className={`
          w-11 h-11 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ease-out
          ${path === "/" 
            ? `bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white scale-105` 
            : `${darkMode ? "bg-white/5 text-slate-400 group-hover:bg-white/10" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"}`}
        `}>
          <LayoutDashboard size={20} className={`transition-transform duration-300 ${path === "/" ? "scale-110" : "group-hover:scale-110"}`} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${path === "/" ? "text-indigo-500" : darkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}>Explore</span>
      </button>

      {/* My Events */}
      <button onClick={() => navigate("/my-events")} className="flex flex-col items-center gap-1.5 w-16 group outline-none">
        <div className={`
          w-11 h-11 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ease-out
          ${path === "/my-events" 
            ? `bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white scale-105` 
            : `${darkMode ? "bg-white/5 text-slate-400 group-hover:bg-white/10" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"}`}
        `}>
          <Calendar size={20} className={`transition-transform duration-300 ${path === "/my-events" ? "scale-110" : "group-hover:scale-110"}`} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${path === "/my-events" ? "text-indigo-500" : darkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}>My Events</span>
      </button>

      {/* Create */}
      <button onClick={() => navigate("/create-event")} className={`flex flex-col items-center gap-1.5 w-16 outline-none group ${path === "/create-event" ? "-mt-6" : ""}`}>
        <div className={`
          flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
          ${path === "/create-event" 
            ? "w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-violet-500 shadow-2xl shadow-indigo-500/40 border-[4px] border-white dark:border-[#0F0121] scale-[1.1]" 
            : `w-11 h-11 rounded-[1.25rem] ${darkMode ? "bg-white/5 text-slate-400 group-hover:bg-white/10" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"}`}
        `}>
          <PlusSquare size={path === "/create-event" ? 24 : 20} className={`transition-transform duration-300 ${path === "/create-event" ? "text-white scale-110" : "group-hover:scale-110"}`} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${path === "/create-event" ? "text-indigo-500" : darkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}>Create Event</span>
      </button>

      {/* Profile or Login */}
      {user ? (
        <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1.5 w-16 group outline-none">
          <div className={`
            w-11 h-11 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ease-out
            ${path === "/profile" 
              ? `bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white scale-105` 
              : `${darkMode ? "bg-white/5 text-slate-400 group-hover:bg-white/10" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"}`}
          `}>
            <User size={20} className={`transition-transform duration-300 ${path === "/profile" ? "scale-110" : "group-hover:scale-110"}`} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${path === "/profile" ? "text-indigo-500" : darkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}>Profile</span>
        </button>
      ) : (
        <button onClick={() => navigate("/login")} className="flex flex-col items-center gap-1.5 w-16 group outline-none">
          <div className={`
            w-11 h-11 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ease-out
            ${path === "/login" 
              ? `bg-indigo-600 shadow-xl shadow-indigo-600/30 text-white scale-105` 
              : `${darkMode ? "bg-white/5 text-slate-400 group-hover:bg-white/10" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"}`}
          `}>
            <LogIn size={20} className={`transition-transform duration-300 ${path === "/login" ? "scale-110" : "group-hover:scale-110"}`} />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${path === "/login" ? "text-indigo-500" : darkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}>Log In</span>
        </button>
      )}
    </nav>
  );
}
