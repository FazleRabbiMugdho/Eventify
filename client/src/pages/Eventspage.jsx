import React, { useState, useMemo, useContext, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard, Calendar, PlusSquare, Search, Bell,
  MapPin, ArrowRight, TrendingUp, Filter, X, SearchX,
  MessageCircle, Send, Paperclip, Ticket, PartyPopper,
  ChevronLeft, ChevronRight, ChevronDown, Settings, Sparkles,
  Menu, User,
} from "lucide-react";
import {
  AnimationStyles, FadeIn, FadeInGroup, InViewFade,
  SkeletonCarousel, SkeletonEventGrid, usePageLoad,
} from "../components/ui";

import ApiClient from "../api";
import { secrets } from "../secrets";


// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All", "Music", "Tech", "Business", "Sports",
  "Art", "Food", "Wellness", "Comedy",
];

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Event Starting Soon",
    desc: "Summer Music Festival starts in 2 hours",
    time: "2 hours ago",
    color: "bg-indigo-600",
    icon: <Calendar size={20} />,
    unread: true,
  },
  {
    id: 2,
    title: "Registration Confirmed",
    desc: "Your ticket for Tech Summit 2026 is confirmed",
    time: "5 hours ago",
    color: "bg-blue-600",
    icon: <Ticket size={20} />,
    unread: true,
  },
  {
    id: 3,
    title: "Event Update",
    desc: "New speaker added to AI Conference",
    time: "1 day ago",
    color: "bg-orange-500",
    icon: <Bell size={20} />,
    unread: false,
  },
  {
    id: 4,
    title: "Event Success",
    desc: "Your event 'Startup Meetup' reached 100 attendees!",
    time: "2 days ago",
    color: "bg-emerald-500",
    icon: <PartyPopper size={20} />,
    unread: false,
  },
];

const INITIAL_VISIBLE = 6;

// ─── Styles ───────────────────────────────────────────────────────────────────

const getGlobalStyles = (priceRange, darkMode) => `
  .no-scrollbar::-webkit-scrollbar { display: none; }

  input[type='range'] { -webkit-appearance: none; background: transparent; }

  input[type='range']::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    background: linear-gradient(
      to right,
      #6366f1 ${(priceRange / 1000000) * 100}%,
      ${darkMode ? "#1E0B3B" : "#f1f5f9"} ${(priceRange / 1000000) * 100}%
    );
    border-radius: 10px;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #6366f1;
    cursor: pointer;
    margin-top: -7px;
    border: 3px solid ${darkMode ? "#0F0121" : "white"};
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
  }

  .ripple-btn {
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
  }
  .ripple-btn:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0; left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.5s, opacity 1s;
  }
  .ripple-btn:active:after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }

  .search-overlay-enter {
    animation: slideUpOverlay 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes slideUpOverlay {
    from { opacity: 0; transform: translateY(60px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0px)  scale(1);    }
  }

  .featured-fade-exit  { animation: featuredFadeOut 0.3s ease forwards; }
  .featured-fade-enter { animation: featuredFadeIn  0.4s ease forwards; }

  @keyframes featuredFadeOut {
    from { opacity: 1; transform: translateY(0);     }
    to   { opacity: 0; transform: translateY(-20px); }
  }
  @keyframes featuredFadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0);     }
  }

  .event-card-appear {
    animation: cardAppear 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  .show-more-card {
    animation: showMoreCard 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes showMoreCard {
    from { opacity: 0; transform: translateY(48px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* ── Hero section animations ── */
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(40px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes heroBtnPop {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes heroGlowPulse {
    0%, 100% { opacity: 0.15; transform: scale(1);    }
    50%      { opacity: 0.3;  transform: scale(1.08); }
  }
  @keyframes heroBtnClick {
    0%   { transform: scale(1);    }
    40%  { transform: scale(0.93); }
    100% { transform: scale(1);    }
  }
  .hero-fade-up {
    animation: heroFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .hero-btn-pop {
    animation: heroBtnPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .hero-glow {
    animation: heroGlowPulse 4s ease-in-out infinite;
  }
  .hero-btn-click {
    animation: heroBtnClick 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  /* ── Mobile bottom nav safe area ── */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    .bottom-nav {
      padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
    }
  }

  /* ── Tablet sidebar tooltip ── */
  .tab-tooltip {
    position: absolute;
    left: 100%;
    margin-left: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: #6366f1;
    color: white;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 8px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 999;
  }
  .tab-nav-btn:hover .tab-tooltip {
    opacity: 1;
  }

  /* ── Carousel touch swipe ── */
  .carousel-container {
    touch-action: pan-y;
  }

  /* ── Mobile drawer backdrop ── */
  .drawer-backdrop {
    animation: fadeIn 0.25s ease forwards;
  }
  .drawer-slide {
    animation: slideInRight 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to   { transform: translateX(0);    }
  }
`;

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

// ─── Shared Event Card ─────────────────────────────────────────────────────────

function EventCard({ event, darkMode, navigate, index = 0, extraClass = "event-card-appear" }) {
  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`
        group rounded-[40px] sm:rounded-[48px] p-4 sm:p-5 ${extraClass}
        transition-all duration-500 cursor-pointer hover:-translate-y-3
        ${darkMode
          ? "bg-[#1E0B3B] hover:shadow-[0_40px_80px_-15px_rgba(99,102,241,0.15)]"
          : "bg-white border border-slate-50 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]"
        }
      `}
    >
      {/* Thumbnail */}
      <div className="relative h-48 sm:h-72 rounded-[28px] sm:rounded-[36px] overflow-hidden mb-5 sm:mb-8 shadow-inner">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
        />
        <div
          className={`
            absolute top-3 sm:top-5 right-3 sm:right-5 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl
            shadow-2xl backdrop-blur-xl border border-white/20
            ${darkMode ? "bg-[#0F0121]/80 text-white" : "bg-white/90 text-slate-900"}
          `}
        >
          <span className="font-black text-sm sm:text-base">BDT {event.price}</span>
        </div>
      </div>

      {/* Details */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-4">
        <span className="text-[10px] sm:text-[11px] font-black uppercase text-indigo-500 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-500/10 rounded-xl tracking-widest">
          {event.category}
        </span>
        <h4
          className={`
            text-base sm:text-xl font-black mt-4 sm:mt-6 mb-5 sm:mb-8 tracking-tight leading-snug
            group-hover:text-indigo-500 transition-colors
            ${darkMode ? "text-white" : "text-slate-900"}
          `}
        >
          {event.title}
        </h4>
        <div
          className={`
            flex items-center justify-between pt-4 sm:pt-6 border-t-2
            ${darkMode ? "border-white/5" : "border-slate-50"}
          `}
        >
          <span className="font-black text-[11px] sm:text-[12px] uppercase flex items-center gap-2 sm:gap-3 text-slate-400">
            <Calendar size={14} /> {event.date}
          </span>
          <button className="text-indigo-600 font-black text-[12px] sm:text-[13px] uppercase tracking-[0.1em] flex items-center gap-1.5 sm:gap-2 hover:gap-4 transition-all">
            Buy Now <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Desktop Sidebar (lg+) ────────────────────────────────────────────────────

function DesktopSidebar({ darkMode, navigate }) {
  const navBase = `
    w-full flex items-center gap-4 px-5 py-4
    rounded-[22px] font-bold text-[15px]
    transition-all duration-300 ripple-btn
  `;
  const active = "bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30";
  const inactive = darkMode
    ? "text-slate-400 hover:text-white hover:bg-white/5"
    : "text-slate-500 hover:bg-slate-50";

  return (
    <aside
      className={`
        hidden lg:flex
        w-72 border-r transition-all duration-500
        flex-col sticky top-0 h-screen z-50 shrink-0
        ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}
      `}
    >
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 shrink-0">
          <LogoIcon />
        </div>
        <div className="flex flex-col">
          <span className={`text-2xl font-black tracking-tighter ${darkMode ? "text-white" : "text-indigo-600"}`}>
            Eventify
          </span>
          <span className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-indigo-400"}`}>
            Ticketing & Management
          </span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-3 mt-8">
        <button onClick={() => navigate("/")} className={`${navBase} ${active}`}>
          <LayoutDashboard size={20} /> Explore
        </button>
        <button onClick={() => navigate("/my-events")} className={`${navBase} ${inactive}`}>
          <Calendar size={20} /> My Events
        </button>
        <button onClick={() => navigate("/create-event")} className={`${navBase} ${inactive}`}>
          <PlusSquare size={20} /> Create Event
        </button>
      </nav>
    </aside>
  );
}

// ─── Tablet Sidebar (md, icon-only with tooltips) ─────────────────────────────

function TabletSidebar({ darkMode, navigate }) {
  return (
    <aside
      className={`
        hidden md:flex lg:hidden
        w-20 border-r transition-all duration-500
        flex-col sticky top-0 h-screen z-50 shrink-0
        items-center
        ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}
      `}
    >
      {/* Logo icon */}
      <div className="pt-6 pb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
          <LogoIcon />
        </div>
      </div>

      <div className={`w-8 h-px mb-4 ${darkMode ? "bg-white/10" : "bg-slate-100"}`} />

      <nav className="flex flex-col gap-3 px-3 flex-1">
        <button
          onClick={() => navigate("/")}
          className={`
            tab-nav-btn relative w-14 h-14 rounded-2xl flex items-center justify-center
            transition-all ripple-btn
            bg-indigo-600 text-white shadow-xl shadow-indigo-600/30
          `}
        >
          <LayoutDashboard size={20} />
          <span className="tab-tooltip">Explore</span>
        </button>
        <button
          onClick={() => navigate("/my-events")}
          className={`
            tab-nav-btn relative w-14 h-14 rounded-2xl flex items-center justify-center
            transition-all ripple-btn
            ${darkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50"}
          `}
        >
          <Calendar size={20} />
          <span className="tab-tooltip">My Events</span>
        </button>
        <button
          onClick={() => navigate("/create-event")}
          className={`
            tab-nav-btn relative w-14 h-14 rounded-2xl flex items-center justify-center
            transition-all ripple-btn
            ${darkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50"}
          `}
        >
          <PlusSquare size={20} />
          <span className="tab-tooltip">Create Event</span>
        </button>
      </nav>
    </aside>
  );
}

// ─── Mobile Bottom Navigation ─────────────────────────────────────────────────

function MobileBottomNav({ darkMode, navigate, onNotifPress, onProfilePress, unreadCount }) {
  return (
    <nav
      className={`
        bottom-nav md:hidden
        fixed bottom-0 left-0 right-0 z-50
        flex items-center justify-around
        px-4 pt-3 pb-4
        border-t backdrop-blur-xl
        ${darkMode
          ? "bg-[#0F0121]/95 border-white/5"
          : "bg-white/95 border-slate-100"
        }
      `}
    >
      {/* Explore — active */}
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center gap-1 px-3 py-1"
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <LayoutDashboard size={18} className="text-white" />
        </div>
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">Explore</span>
      </button>

      {/* My Events */}
      <button
        onClick={() => navigate("/my-events")}
        className="flex flex-col items-center gap-1 px-3 py-1"
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
          <Calendar size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          My Events
        </span>
      </button>

      {/* Create */}
      <button
        onClick={() => navigate("/create-event")}
        className="flex flex-col items-center gap-1 px-3 py-1 -mt-6"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-600/40 border-4 border-white dark:border-[#0F0121]">
          <PlusSquare size={22} className="text-white" />
        </div>
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mt-1">Create</span>
      </button>

      {/* Notifications */}
      <button
        onClick={onNotifPress}
        className="flex flex-col items-center gap-1 px-3 py-1 relative"
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
          <Bell size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} />
        </div>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#0F0121]">
            {unreadCount}
          </span>
        )}
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          Alerts
        </span>
      </button>

      {/* Profile */}
      <button
        onClick={onProfilePress}
        className="flex flex-col items-center gap-1 px-3 py-1"
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
          <User size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          Profile
        </span>
      </button>
    </nav>
  );
}

// ─── Mobile Top Bar ───────────────────────────────────────────────────────────

function MobileTopBar({ darkMode, searchQuery, setSearchQuery, isSearchActive, setIsSearchActive }) {
  return (
    <div className="md:hidden mb-6">
      {/* Brand row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <LogoIcon />
          </div>
          <div>
            <span className={`text-lg font-black tracking-tighter ${darkMode ? "text-white" : "text-indigo-600"}`}>
              Eventify
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className={`absolute left-5 top-1/2 -translate-y-1/2 z-10 transition-colors ${isSearchActive ? "text-indigo-500" : "text-slate-400"}`}
        />
        <input
          type="text"
          value={searchQuery}
          placeholder="Search events, artists, venues..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchActive(true)}
          className={`
            w-full pl-12 pr-12 py-4 rounded-[22px]
            outline-none font-bold text-sm transition-all duration-300
            ${isSearchActive
              ? darkMode
                ? "bg-[#1E0B3B] border-2 border-indigo-500/50 text-white placeholder:text-slate-500 shadow-lg shadow-indigo-500/10"
                : "bg-white border-2 border-indigo-400/50 text-slate-900 shadow-lg shadow-indigo-500/10"
              : darkMode
                ? "bg-[#1E0B3B] border border-white/5 text-white placeholder:text-slate-500"
                : "bg-white border border-slate-200 text-slate-900"
            }
          `}
        />
        {isSearchActive && (
          <button
            onClick={() => { setSearchQuery(""); setIsSearchActive(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors z-10"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────

function NotificationPanel({ darkMode, showNotif, setShowNotif }) {
  const bellRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    if (showNotif && bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right,
      });
    }
  }, [showNotif]);

  const dropdown = showNotif ? ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-[499]"
        onClick={() => setShowNotif(false)}
      />
      <div
        className={`
          w-[360px] z-[500] border
          rounded-[28px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]
          animate-in fade-in zoom-in-95 duration-300
          ${darkMode ? "bg-[#1E0B3B] border-white/10" : "bg-white border-slate-100"}
        `}
        style={dropdownStyle}
      >
        <div className="p-5">
          <button
            onClick={() => setShowNotif(false)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 font-black text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className={`text-xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                Notifications
              </h2>
              <p className="text-slate-500 font-bold mt-0.5 text-sm">Stay updated</p>
            </div>
            <button className="text-indigo-600 font-black text-sm hover:underline underline-offset-4 decoration-2">
              Mark all read
            </button>
          </div>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={`
                  p-3 rounded-[18px] border flex gap-3
                  transition-all cursor-pointer hover:translate-x-1
                  ${darkMode
                    ? "bg-[#0F0121] border-white/5 hover:bg-white/5"
                    : "bg-[#F8FAFC] border-slate-100 shadow-sm hover:bg-white hover:border-indigo-100"
                  }
                `}
              >
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-white shrink-0 ${n.color}`}>
                  {React.cloneElement(n.icon, { size: 16 })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-black text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>{n.title}</h4>
                    {n.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1 ml-2" />}
                  </div>
                  <p className="text-slate-500 text-xs font-bold mt-0.5 leading-relaxed">{n.desc}</p>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setShowNotif(!showNotif)}
        className={`
          p-4 rounded-[22px] ripple-btn shadow-sm
          transition-all flex items-center justify-center
          ${showNotif
            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
            : darkMode
              ? "bg-[#1E0B3B] text-slate-300 hover:bg-white/5"
              : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
          }
        `}
      >
        <Bell size={24} />
      </button>
      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white text-[11px] font-black flex items-center justify-center rounded-full border-[3px] border-white shadow-lg">
        3
      </span>
      {dropdown}
    </div>
  );
}

// ─── Desktop/Tablet Top Bar ───────────────────────────────────────────────────

function TopBar({
  darkMode, navigate,
  searchQuery, setSearchQuery,
  showNotif, setShowNotif,
  user, userInitials, isSearchActive, setIsSearchActive,
}) {
  return (
    <header className="hidden md:flex items-center justify-between mb-10 lg:mb-12 gap-6 lg:gap-10 max-w-full mx-auto">
      <div className="relative flex-1 max-w-3xl group">
        <Search
          size={22}
          className={`absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-10 transition-colors ${isSearchActive ? "text-indigo-500" : "text-slate-400"}`}
        />
        <input
          type="text"
          value={searchQuery}
          placeholder="Search for events, artists, or venues..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchActive(true)}
          className={`
            w-full pl-16 lg:pl-20 pr-14 py-4 lg:py-5 rounded-[24px] lg:rounded-[28px] shadow-sm
            focus:ring-4 focus:ring-indigo-500/10 outline-none
            font-bold text-sm lg:text-base transition-all duration-300
            ${isSearchActive
              ? darkMode
                ? "bg-[#1E0B3B] border-2 border-indigo-500/50 text-white placeholder:text-slate-500 shadow-xl shadow-indigo-500/10"
                : "bg-white border-2 border-indigo-400/50 text-slate-900 shadow-xl shadow-indigo-500/10"
              : darkMode
                ? "bg-[#1E0B3B] border-none text-white placeholder:text-slate-500"
                : "bg-white border-slate-200 text-slate-900"
            }
          `}
        />
        {isSearchActive && (
          <button
            onClick={() => { setSearchQuery(""); setIsSearchActive(false); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors z-10"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 lg:gap-5 relative">
        <NotificationPanel darkMode={darkMode} showNotif={showNotif} setShowNotif={setShowNotif} />

        {user ? (
          <div
            onClick={() => navigate("/profile")}
            className="ml-1 lg:ml-2 cursor-pointer group"
          >
            <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm lg:text-lg font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              {userInitials}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="ml-1 lg:ml-2 px-5 lg:px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ darkMode, navigate, setIsSearchActive }) {
  const [exploreClicked, setExploreClicked] = useState(false);
  const [createClicked, setCreateClicked] = useState(false);

  const handleExplore = () => {
    setExploreClicked(true);
    setTimeout(() => {
      setExploreClicked(false);
      setIsSearchActive(true);
      // smooth scroll to search results area
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 350);
  };

  const handleCreate = () => {
    setCreateClicked(true);
    setTimeout(() => {
      navigate("/create-event");
    }, 350);
  };

  return (
    <section className="mb-10 sm:mb-16 max-w-full">
      <div
        className={`
          relative rounded-[32px] sm:rounded-[48px] overflow-hidden
          px-6 sm:px-16 py-10 sm:py-14 text-center
          flex flex-col items-center justify-center
          ${darkMode
            ? "bg-[#1E0B3B] border border-white/5"
            : "bg-white border border-slate-100 shadow-sm"
          }
        `}
      >
        {/* ── Ambient glow blobs ── */}
        <div
          className="hero-glow absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)" }}
        />
        <div
          className="hero-glow absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(236,72,153,0.1) 0%, transparent 70%)",
            animationDelay: "1s",
          }}
        />

        {/* ── Headline ── */}
        <h1
          className="hero-fade-up relative z-10 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-5"
          style={{
            animationDelay: "0ms",
            backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 35%, #f472b6 65%, #fb7185 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Create. Connect.<br />Celebrate.
        </h1>

        {/* ── Subtitle ── */}
        <p
          className={`
            hero-fade-up relative z-10
            text-sm sm:text-base lg:text-lg font-bold leading-relaxed
            max-w-xl sm:max-w-2xl mb-6 sm:mb-8
            ${darkMode ? "text-slate-400" : "text-slate-500"}
          `}
          style={{ animationDelay: "120ms" }}
        >
          Discover amazing events or create your own unforgettable experiences
          with Eventify, the ultimate event management platform.
        </p>

        {/* ── CTA Buttons ── */}
        <div
          className="hero-btn-pop relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-5"
          style={{ animationDelay: "220ms" }}
        >
          {/* Explore Events */}
          <button
            onClick={handleExplore}
            className={`
              group flex items-center gap-3
              px-7 sm:px-10 py-4 sm:py-5
              rounded-[18px] sm:rounded-[22px]
              font-black text-sm sm:text-base text-white
              bg-indigo-600 hover:bg-indigo-700
              shadow-2xl shadow-indigo-600/40
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-indigo-600/50
              active:scale-95
              w-full sm:w-auto
              ${exploreClicked ? "hero-btn-click" : ""}
            `}
          >
            Explore Events
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          {/* Create Event */}
          <button
            onClick={handleCreate}
            className={`
              flex items-center gap-3
              px-7 sm:px-10 py-4 sm:py-5
              rounded-[18px] sm:rounded-[22px]
              font-black text-sm sm:text-base
              border-2 transition-all duration-300
              hover:-translate-y-1
              active:scale-95
              w-full sm:w-auto
              ${createClicked ? "hero-btn-click" : ""}
              ${darkMode
                ? "border-white/15 text-white hover:border-indigo-400/60 hover:bg-white/5"
                : "border-slate-200 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50"
              }
            `}
          >
            <PlusSquare size={18} className="text-indigo-500" />
            Create Event
          </button>
        </div>


      </div>
    </section>
  );
}

// ─── Featured Carousel ────────────────────────────────────────────────────────

function FeaturedEvents({ darkMode, navigate, isSearchActive, featuredEvents }) {
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState("next");
  const timerRef = useRef(null);
  const slidingRef = useRef(false);
  const currentRef = useRef(0);
  const touchStartX = useRef(null);
  const total = featuredEvents.length;

  useEffect(() => { currentRef.current = current; }, [current]);

  const goTo = useCallback((index, dir = "next") => {
    if (slidingRef.current) return;
    slidingRef.current = true;
    setDirection(dir);
    setSliding(true);
    setTimeout(() => {
      setCurrent(index);
      setSliding(false);
      slidingRef.current = false;
    }, 400);
  }, []);

  const goNext = useCallback(() => goTo((currentRef.current + 1) % total, "next"), [goTo, total]);
  const goPrev = useCallback(() => goTo((currentRef.current - 1 + total) % total, "prev"), [goTo, total]);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      goTo((currentRef.current + 1) % total, "next");
    }, 4000);
  }, [goTo, total]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []); // eslint-disable-line

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopTimer();
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    startTimer();
  };

  const event = featuredEvents[current];
  if (!event) return null;

  return (
    <section
      className={`mb-10 sm:mb-16 max-w-full ${isSearchActive ? "featured-fade-exit pointer-events-none" : "featured-fade-enter"}`}
      style={{ display: isSearchActive ? "none" : "block" }}
    >
      {/* Heading + arrows */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Featured Events
        </h2>
        {/* Arrows hidden on mobile (swipe instead) */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onMouseDown={(e) => { e.preventDefault(); goPrev(); }}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center
              transition-all ripple-btn shadow-sm
              ${darkMode
                ? "bg-[#1E0B3B] text-slate-300 hover:bg-indigo-600 hover:text-white border border-white/5"
                : "bg-white text-slate-500 hover:bg-indigo-600 hover:text-white border border-slate-100"
              }
            `}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button
            onMouseDown={(e) => { e.preventDefault(); goNext(); }}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center
              transition-all ripple-btn shadow-sm
              ${darkMode
                ? "bg-[#1E0B3B] text-slate-300 hover:bg-indigo-600 hover:text-white border border-white/5"
                : "bg-white text-slate-500 hover:bg-indigo-600 hover:text-white border border-slate-100"
              }
            `}
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Handpicked label */}
      <div className="flex items-center gap-4 mb-5 sm:mb-10">
        <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] whitespace-nowrap ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          Handpicked For You
        </h3>
        <div className={`h-[2px] flex-1 ${darkMode ? "bg-white/5" : "bg-slate-100"}`} />
      </div>

      {/* Carousel card — touch-enabled */}
      <div
        className="carousel-container relative w-full h-[280px] sm:h-[380px] lg:h-[480px] rounded-[32px] sm:rounded-[40px] lg:rounded-[50px] overflow-hidden shadow-2xl cursor-pointer"
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => navigate(`/event/${event.id}`)}
      >
        <img
          key={current}
          src={event.image}
          alt={event.title}
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-all duration-700 ease-in-out
            ${sliding
              ? direction === "next" ? "opacity-0 scale-105" : "opacity-0 scale-95"
              : "opacity-100 scale-100"
            }
          `}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0121] via-[#0F0121]/30 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-10 flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-lg border border-white/20">
          <Sparkles size={12} className="text-white animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-widest">Featured</span>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-10">
          <span className="px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] sm:text-[11px] font-black uppercase text-white tracking-widest">
            {event.category}
          </span>
        </div>

        {/* Slide counter */}
        <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-10">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-black backdrop-blur-md border border-white/20 text-white bg-black/20">
            {current + 1} / {total}
          </span>
        </div>

        {/* Event info */}
        <div className="absolute bottom-5 sm:bottom-10 left-5 sm:left-10 right-5 sm:right-10 text-white z-10">
          <div
            key={`info-${current}`}
            className={`transition-all duration-500 ${sliding ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            <div className="flex items-center gap-1.5 text-indigo-300 font-black text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-widest">
              <MapPin size={12} /> {event.location}
            </div>
            <h4 className="text-xl sm:text-3xl lg:text-5xl font-black mb-3 sm:mb-6 leading-tight tracking-tight">
              {event.title}
            </h4>
            <div className="flex items-center justify-between pt-3 sm:pt-6 border-t border-white/10">
              <div className="flex items-center gap-5 sm:gap-10">
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-black text-indigo-400 tracking-widest">Price</p>
                  <span className="text-2xl sm:text-4xl font-black">BDT {event.price}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Date</p>
                  <span className="text-lg font-black">{event.date}</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/event/${event.id}`); }}
                className={`
                  px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl
                  flex items-center gap-2 sm:gap-3
                  font-black text-xs sm:text-sm shadow-xl transition-all ripple-btn
                  ${darkMode
                    ? "bg-white/10 backdrop-blur-md text-white hover:bg-indigo-600 border border-white/20"
                    : "bg-white text-slate-950 hover:bg-indigo-600 hover:text-white"
                  }
                `}
              >
                Get Tickets <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
          {featuredEvents.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i, i > current ? "next" : "prev"); }}
              className={`
                rounded-full transition-all duration-300
                ${i === current
                  ? "w-6 sm:w-8 h-2 sm:h-3 bg-white shadow-lg"
                  : "w-2 sm:w-3 h-2 sm:h-3 bg-white/40 hover:bg-white/70"
                }
              `}
            />
          ))}
        </div>

        {/* Mobile swipe hint — only on first render */}
        <div className="sm:hidden absolute bottom-16 right-5 z-10 flex items-center gap-1 text-white/60 text-[10px] font-bold">
          <ChevronLeft size={12} /> swipe <ChevronRight size={12} />
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "Step 1",
    title: "Discover Events",
    desc: "Browse through thousands of events or use our smart filters to find exactly what you're looking for.",
    emoji: "🔍",
    color: "from-indigo-500/20 to-violet-500/10",
    border: "border-indigo-500/20",
    stepColor: "text-indigo-400",
  },
  {
    step: "Step 2",
    title: "Book Your Spot",
    desc: "Secure your tickets instantly with our simple and safe booking process. Get instant confirmation.",
    emoji: "🎟️",
    color: "from-amber-500/15 to-orange-500/10",
    border: "border-amber-500/20",
    stepColor: "text-amber-400",
  },
  {
    step: "Step 3",
    title: "Celebrate Together",
    desc: "Show up and enjoy! Connect with like-minded people and create unforgettable memories.",
    emoji: "🎉",
    color: "from-rose-500/15 to-pink-500/10",
    border: "border-rose-500/20",
    stepColor: "text-rose-400",
  },
];

function HowItWorks({ darkMode, isSearchActive }) {
  if (isSearchActive) return null;

  return (
    <section className="mb-10 sm:mb-16 max-w-full">
      {/* Section heading */}
      <div className="text-center mb-8 sm:mb-12">
        <h2
          className={`text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          How It Works
        </h2>
        <p className={`text-sm sm:text-base font-bold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Getting started is simple and quick
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {HOW_IT_WORKS.map((item, i) => (
          <div
            key={item.step}
            className={`
              relative rounded-[28px] sm:rounded-[36px] p-6 sm:p-8
              border backdrop-blur-sm
              transition-all duration-500 hover:-translate-y-2
              bg-gradient-to-br ${item.color} ${item.border}
              ${darkMode ? "bg-[#1E0B3B]/80" : "bg-white/80 shadow-sm"}
            `}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Emoji icon */}
            <div className="text-5xl sm:text-6xl mb-5 sm:mb-6 select-none">
              {item.emoji}
            </div>

            {/* Divider line matching screenshot */}
            <div
              className={`
                absolute right-6 sm:right-8 top-1/2 -translate-y-1/2
                hidden sm:block w-px h-10
                ${i < HOW_IT_WORKS.length - 1 ? "bg-indigo-500/30" : "hidden"}
              `}
            />

            {/* Step label */}
            <p className={`text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2 ${item.stepColor}`}>
              {item.step}
            </p>

            {/* Title */}
            <h3 className={`text-lg sm:text-xl font-black mb-3 sm:mb-4 tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              {item.title}
            </h3>

            {/* Description */}
            <p className={`text-sm font-bold leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────

function SearchOverlay({
  darkMode, navigate,
  filteredEvents, searchQuery, isSearchActive,
  showFilters, setShowFilters,
  selectedCategory, setSelectedCategory,
  priceRange, setPriceRange,
  startDate, setStartDate,
  endDate, setEndDate,
  setSearchQuery,
  isLoading,
}) {
  if (!isSearchActive) return null;

  return (
    <section className="mb-10 sm:mb-16 max-w-full search-overlay-enter">
      <div className="mb-6 sm:mb-8">
        <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Discover Events
        </h2>
        <p className={`font-bold mt-1 sm:mt-2 text-sm sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Browse experiences happening near you
        </p>
      </div>

      {/* Filter toggle + category pills */}
      <div className="flex items-center gap-3 sm:gap-5 mb-5 sm:mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg transition-all ripple-btn shrink-0
            ${showFilters
              ? "bg-indigo-600 text-white shadow-indigo-600/30"
              : darkMode
                ? "bg-[#1E0B3B] text-slate-400"
                : "bg-white text-slate-400 border border-slate-100"
            }
          `}
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
        </button>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar flex-1 py-1 sm:py-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 sm:px-10 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl
                text-[11px] sm:text-[12px] font-black uppercase
                tracking-[0.1em] sm:tracking-[0.15em]
                transition-all whitespace-nowrap shadow-sm ripple-btn
                ${selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                  : darkMode
                    ? "bg-[#1E0B3B] text-slate-400 hover:text-white"
                    : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          className={`
            p-6 sm:p-10 rounded-[32px] sm:rounded-[48px] shadow-3xl mb-8 sm:mb-10
            grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12
            animate-in slide-in-from-top-4 duration-500
            ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}
          `}
        >
          <div className="space-y-4 sm:space-y-5">
            <label className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">
              Select Date Range
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`
                  flex-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl outline-none font-bold text-sm border
                  ${darkMode ? "bg-[#0F0121] text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"}
                `}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`
                  flex-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl outline-none font-bold text-sm border
                  ${darkMode ? "bg-[#0F0121] text-white border-white/5" : "bg-slate-50 text-slate-900 border-slate-200"}
                `}
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">Price Cap</label>
              <span className="text-indigo-400 font-black text-base sm:text-lg">BDT {priceRange}</span>
            </div>
            <input
              type="range" min="0" max="1000000" value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full cursor-pointer h-2 bg-indigo-100 rounded-lg appearance-none"
            />
            <div className="flex justify-between items-center pt-1 sm:pt-2">
              <button
                onClick={() => { setPriceRange(1000000); setStartDate(""); setEndDate(""); setSelectedCategory("All"); setSearchQuery(""); }}
                className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400"
              >
                Clear All
              </button>
              <span className="text-[10px] font-bold text-slate-400">0 – 1,000,000 BDT</span>
            </div>
          </div>
        </div>
      )}

      <p className={`font-bold mb-5 sm:mb-8 text-sm sm:text-base ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
        {searchQuery && (
          <span className={`ml-2 font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
            for "{searchQuery}"
          </span>
        )}
      </p>

      {isLoading ? (
        <SkeletonEventGrid darkMode={darkMode} count={3} />
      ) : filteredEvents.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 sm:py-24 rounded-[32px] sm:rounded-[48px] ${darkMode ? "bg-[#1E0B3B]" : "bg-white border border-slate-100"}`}>
          <SearchX size={44} className="text-slate-300 mb-5" />
          <p className={`text-lg font-black ${darkMode ? "text-slate-400" : "text-slate-500"}`}>No events found</p>
          <p className="text-slate-400 font-bold mt-2 text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} darkMode={darkMode} navigate={navigate} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Event Grid ───────────────────────────────────────────────────────────────

function EventGrid({ darkMode, navigate, filteredEvents, isSearchActive }) {
  const [showAll, setShowAll] = useState(false);
  const visibleEvents = showAll ? filteredEvents : filteredEvents.slice(0, INITIAL_VISIBLE);
  const hiddenCount = filteredEvents.length - INITIAL_VISIBLE;

  return (
    <section
      className={`
        pb-24 sm:pb-32 max-w-full transition-all duration-300
        ${isSearchActive ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100"}
      `}
    >
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Discover Events
          </h2>
          <p className={`font-bold mt-1 sm:mt-2 text-sm sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Browse experiences happening near you
          </p>
        </div>
        <span className={`text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-500/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full`}>
          {filteredEvents.length} Events
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-12">
        {visibleEvents.map((event, index) => (
          <EventCard
            key={event.id} event={event} darkMode={darkMode} navigate={navigate} index={index}
            extraClass={index >= INITIAL_VISIBLE ? "show-more-card" : "event-card-appear"}
          />
        ))}
      </div>

      {filteredEvents.length > INITIAL_VISIBLE && (
        <div className="flex justify-center mt-10 sm:mt-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`
              group flex items-center gap-3 sm:gap-4 px-8 sm:px-14 py-4 sm:py-6
              rounded-[22px] sm:rounded-[28px] font-black text-sm sm:text-base
              transition-all duration-500 ripple-btn
              shadow-xl hover:shadow-2xl hover:-translate-y-1
              ${darkMode
                ? "bg-[#1E0B3B] text-white border border-white/10 hover:bg-indigo-600 hover:border-indigo-600 hover:shadow-indigo-600/20"
                : "bg-white text-slate-900 border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-indigo-600/20"
              }
            `}
          >
            {showAll ? (
              <>Show Less <ChevronDown size={18} className="rotate-180 transition-transform duration-300" /></>
            ) : (
              <>Show {hiddenCount} More <ChevronDown size={18} className="transition-transform duration-300 group-hover:translate-y-1" /></>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

// ─── AI Chat Widget ───────────────────────────────────────────────────────────

function AIChatWidget({ darkMode, isChatOpen, setIsChatOpen }) {
  // basic states for the chat functionality
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm the Eventify Assistant. Discover concerts, tech summits, or get help with your ticket booking instantly. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // auto-scroll to the bottom whenever a new message pops up
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  // fires when user clicks send or hits enter
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput(""); // clear input box immediately
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const api = new ApiClient();
      const response = await api.chatWithAI(userMsg);

      if (response?.reply) {
        setMessages((prev) => [...prev, { role: "bot", text: response.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "I couldn't generate a response right now. Please try again." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Oops, having trouble connecting to the server right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-12 left-4 sm:left-12 z-[90] flex flex-col items-start">
      {isChatOpen && (
        <div
          className={`
            w-[calc(100vw-2rem)] sm:w-[360px] h-[440px] sm:h-[520px]
            mb-3 sm:mb-4 rounded-[1.5rem] sm:rounded-[2rem]
            shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]
            overflow-hidden flex flex-col transition-all duration-500
            animate-in slide-in-from-left-12 border backdrop-blur-3xl
            ${darkMode ? "bg-[#120626]/95 border-white/10" : "bg-white/95 border-slate-200"}
          `}
        >
          {/* header area */}
          <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-4 sm:p-5 flex items-center justify-between shadow-xl shrink-0">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-xl backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-inner">
                  <Sparkles className="text-white" size={22} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-[3px] sm:border-[4px] border-indigo-700 shadow-lg animate-pulse" />
              </div>
              <div>
                <h4 className="text-white font-black text-base tracking-tight">Eventify AI</h4>
                <p className="text-indigo-100/70 font-bold text-[10px] uppercase tracking-widest">Always active</p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2.5 sm:p-3 bg-white/10 rounded-xl text-white hover:bg-rose-500 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* dynamic chat messages area */}
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold ${msg.role === "user"
                  ? "bg-indigo-600 text-white self-end rounded-br-sm"
                  : darkMode
                    ? "bg-white/10 text-slate-200 self-start rounded-bl-sm"
                    : "bg-slate-100 text-slate-800 self-start rounded-bl-sm"
                  }`}
              >
                {msg.text}
              </div>
            ))}

            {/* show a little typing indicator when waiting for gemini */}
            {isLoading && (
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-bold self-start rounded-bl-sm flex gap-1 items-center h-12 ${darkMode ? "bg-white/10" : "bg-slate-100"}`}>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
              </div>
            )}
            {/* invisible div to attach our auto-scroll ref to */}
            <div ref={messagesEndRef} />
          </div>

          {/* input box area */}
          <div className={`p-3 sm:p-4 border-t shrink-0 ${darkMode ? "border-white/5 bg-[#0A0318]/50" : "border-slate-100 bg-slate-50/50"}`}>
            <div
              className={`
                flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border transition-all
                ${darkMode
                  ? "bg-[#1E0B3B] border-white/10 focus-within:border-indigo-500"
                  : "bg-white border-slate-200 focus-within:border-indigo-400"
                }
              `}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message AI..."
                className={`bg-transparent flex-1 outline-none text-[14px] sm:text-[15px] font-bold py-1 sm:py-2 ${darkMode ? "text-white" : "text-slate-900"}`}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 disabled:bg-indigo-400 hover:bg-indigo-700 rounded-[0.8rem] sm:rounded-[1rem] flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* floating toggle button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1rem] sm:rounded-[1.25rem] flex items-center justify-center text-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.5)] hover:scale-110 active:scale-90 transition-all ripple-btn border-2 border-white/10"
      >
        {isChatOpen ? <X size={18} strokeWidth={2.5} /> : <MessageCircle size={18} strokeWidth={2.5} />}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Eventpage() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const loaded = usePageLoad(500);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(1000000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [dynamicEvents, setDynamicEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const api = new ApiClient();
        const evts = await api.getEvents();
        if (evts && Array.isArray(evts)) {
          const mapped = evts.map(e => ({
            id: e.event_id,
            title: e.event_name,
            description: e.description,
            date: e.start_date_time ? e.start_date_time.split(' ')[0] : "2026-06-15",
            time: e.start_date_time && e.start_date_time.includes(' ') ? e.start_date_time.split(' ')[1] : '',
            category: e.category?.category_name || "General",
            location: e.venue?.location || "TBD",
            price: e.tickets && e.tickets.length > 0 ? e.tickets[0].price : 0,
            image: e.image_url 
              ? (e.image_url.startsWith('http') ? e.image_url : `${secrets.backendEndpoint}/storage/${e.image_url}`)
              : "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80"
          }));
          
          if (mapped.length > 0) {
            setDynamicEvents(mapped);
            setFeaturedEvents(mapped.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setIsEventsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const userInitials = useMemo(() => {
    if (!user) return null;
    const name = user.user_name || user.fullName || "";
    const parts = name.trim().split(" ");
    const initials = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2);
    return initials.toUpperCase() || "?";
  }, [user]);

  const filteredEvents = useMemo(() => {
    return dynamicEvents.filter((event) => {
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = event.price <= priceRange;
      const eventDate = new Date(event.date);
      const matchesStart = !startDate || eventDate >= new Date(startDate);
      const matchesEnd = !endDate || eventDate <= new Date(endDate);
      return matchesCategory && matchesSearch && matchesPrice && matchesStart && matchesEnd;
    });
  }, [selectedCategory, searchQuery, priceRange, startDate, endDate, dynamicEvents]);

  return (
    <div
      className={`
        flex min-h-screen w-full transition-colors duration-500 font-sans
        ${darkMode ? "bg-[#0F0121] text-white" : "bg-[#F8FAFC] text-slate-900"}
      `}
    >
      <style>{getGlobalStyles(priceRange, darkMode)}</style>
      <AnimationStyles />

      {/* ── Sidebars ── */}
      <DesktopSidebar darkMode={darkMode} navigate={navigate} />
      <TabletSidebar darkMode={darkMode} navigate={navigate} />

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-5 sm:py-8 lg:py-10 relative overflow-x-hidden no-scrollbar pb-28 md:pb-10">

        {/* Mobile top bar */}
        <FadeIn delay={0}>
          <MobileTopBar
            darkMode={darkMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchActive={isSearchActive}
            setIsSearchActive={setIsSearchActive}
          />
        </FadeIn>

        {/* Desktop/Tablet top bar */}
        <FadeIn delay={0}>
          <TopBar
            darkMode={darkMode}
            navigate={navigate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showNotif={showNotif}
            setShowNotif={setShowNotif}
            user={user}
            userInitials={userInitials}
            isSearchActive={isSearchActive}
            setIsSearchActive={setIsSearchActive}
          />
        </FadeIn>

        <SearchOverlay
          darkMode={darkMode} navigate={navigate}
          filteredEvents={filteredEvents} searchQuery={searchQuery}
          isSearchActive={isSearchActive}
          showFilters={showFilters} setShowFilters={setShowFilters}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          priceRange={priceRange} setPriceRange={setPriceRange}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          setSearchQuery={setSearchQuery}
          isLoading={isEventsLoading}
        />

        {/* Show skeletons while loading, real content after */}
        {!loaded || isEventsLoading ? (
          <div className="space-y-10 sm:space-y-16">
            <SkeletonCarousel darkMode={darkMode} />
            <SkeletonEventGrid darkMode={darkMode} count={6} />
          </div>
        ) : (
          <>
            {/* ── Hero Section — shown above Featured Events ── */}
            {!isSearchActive && (
              <FadeIn delay={40}>
                <HeroSection
                  darkMode={darkMode}
                  navigate={navigate}
                  setIsSearchActive={setIsSearchActive}
                />
              </FadeIn>
            )}

            <FadeIn delay={80}>
              <FeaturedEvents
                darkMode={darkMode} navigate={navigate}
                isSearchActive={isSearchActive}
                featuredEvents={featuredEvents}
              />
            </FadeIn>
            <FadeIn delay={120}>
              <HowItWorks
                darkMode={darkMode}
                isSearchActive={isSearchActive}
              />
            </FadeIn>
            <FadeIn delay={160}>
              <EventGrid
                darkMode={darkMode} navigate={navigate}
                filteredEvents={filteredEvents} isSearchActive={isSearchActive}
              />
            </FadeIn>
          </>
        )}

        <AIChatWidget
          darkMode={darkMode} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}
        />
      </main>

      {/* ── Mobile Bottom Navigation ── */}
      <MobileBottomNav
        darkMode={darkMode}
        navigate={navigate}
        onNotifPress={() => setShowNotif(!showNotif)}
        onProfilePress={() => navigate("/profile")}
        unreadCount={3}
      />

      {/* Mobile notification panel (full-width positioned) */}
      {showNotif && (
        <div className="md:hidden fixed inset-x-4 top-16 z-[200]">
          <div
            className={`
              rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border
              animate-in fade-in zoom-in-95 duration-300
              ${darkMode ? "bg-[#1E0B3B] border-white/10" : "bg-white border-slate-100"}
            `}
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h2 className={`text-xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>Notifications</h2>
                <div className="flex items-center gap-3">
                  <button className="text-indigo-600 font-black text-xs hover:underline">Mark all read</button>
                  <button
                    onClick={() => setShowNotif(false)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-[20px] border flex gap-4 ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-slate-50 border-slate-100"}`}
                  >
                    <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center text-white shrink-0 ${n.color}`}>
                      {React.cloneElement(n.icon, { size: 16 })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-black text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>{n.title}</h4>
                        {n.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1 ml-2" />}
                      </div>
                      <p className="text-slate-500 text-xs font-bold mt-0.5 leading-relaxed">{n.desc}</p>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}