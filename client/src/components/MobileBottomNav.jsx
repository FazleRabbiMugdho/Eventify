import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, PlusSquare, Bell, User } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function MobileBottomNav({ onNotifPress, unreadCount = 0 }) {
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
      <button onClick={() => navigate("/create-event")} className="flex flex-col items-center gap-1 px-1 -mt-8 outline-none group">
        <div className={`
          w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-2xl border-[4px] 
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
          ${path === "/create-event" 
            ? "bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/40 border-white dark:border-[#0F0121] scale-[1.1]" 
            : "bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-600/40 border-white dark:border-[#0F0121] group-hover:scale-[1.15] active:scale-95"}
        `}>
          <PlusSquare size={24} className="text-white" />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 mt-0.5 ${path === "/create-event" ? "text-indigo-600 dark:text-indigo-400" : "text-indigo-500"}`}>Create</span>
      </button>

      {/* Alerts */}
      <button onClick={() => { if (onNotifPress) onNotifPress(); }} className="flex flex-col items-center gap-1.5 w-16 group relative outline-none">
        <div className={`
          w-11 h-11 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 ease-out
          ${darkMode ? "bg-white/5 text-slate-400 group-hover:bg-white/10" : "bg-slate-100/80 text-slate-500 group-hover:bg-slate-200/80"}
        `}>
          <Bell size={20} className="transition-transform duration-300 group-hover:scale-110 group-active:rotate-12" />
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#0F0121] shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
        <span className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${darkMode ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-600"}`}>Alerts</span>
      </button>

      {/* Profile */}
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
        <div className="w-16" />
      )}
    </nav>
  );
}
