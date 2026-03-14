import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Calendar, PlusSquare, Search, Bell, Moon, Sun,
  MapPin, ArrowRight, TrendingUp, Filter, X, SearchX, MessageCircle,
  Send, Paperclip, Mic, BellDot, Zap, CheckCircle, Ticket, PartyPopper,
  ChevronLeft, Settings, LogOut, Sparkles, MoreHorizontal
} from "lucide-react";

import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import img6 from '../assets/6.jpg';

const CATEGORIES = ["All", "Music", "Tech", "Business", "Sports", "Art", "Food", "Wellness", "Comedy"];

const FEATURED_EVENTS = [
  { id: 1, title: "Summer Music Festival 2026", image: img1, price: 89, date: "2026-06-15", location: "Golden Gate Park, SF" },
  { id: 2, title: "Tech Summit 2026", image: img2, price: 299, date: "2026-07-22", location: "Moscone Center, SF" },
  { id: 3, title: "Championship Game Night", image: img3, price: 125, date: "2026-08-05", location: "Oracle Park, SF" },
];

const ALL_UPCOMING = [
  { id: 4, title: "Rock Legends Live", image: img4, price: 125, date: "2026-08-05", category: "Music" },
  { id: 5, title: "AI Expo 2026", image: img5, price: 199, date: "2026-04-18", category: "Tech" },
  { id: 6, title: "World Cup Qualifier", image: img6, price: 75, date: "2026-09-12", category: "Sports" },
  { id: 7, title: "Startup Pitch", image: img2, price: 50, date: "2026-02-28", category: "Business" },
  { id: 8, title: "Jazz Night", image: img1, price: 65, date: "2026-05-20", category: "Music" },
];

const NOTIFICATIONS = [
  { id: 1, title: "Event Starting Soon", desc: "Summer Music Festival starts in 2 hours", time: "2 hours ago", color: "bg-indigo-600", icon: <Calendar size={20} />, unread: true },
  { id: 2, title: "Registration Confirmed", desc: "Your ticket for Tech Summit 2026 is confirmed", time: "5 hours ago", color: "bg-blue-600", icon: <Ticket size={20} />, unread: true },
  { id: 3, title: "Event Update", desc: "New speaker added to AI Conference", time: "1 day ago", color: "bg-orange-500", icon: <Bell size={20} />, unread: false },
  { id: 4, title: "Event Success", desc: "Your event 'Startup Meetup' reached 100 attendees!", time: "2 days ago", color: "bg-emerald-500", icon: <PartyPopper size={20} />, unread: false },
];

export default function Eventpage() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(1000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const filteredEvents = useMemo(() => {
    return ALL_UPCOMING.filter(event => {
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = event.price <= priceRange;
      const eventDate = new Date(event.date);
      const matchesStart = !startDate || eventDate >= new Date(startDate);
      const matchesEnd = !endDate || eventDate <= new Date(endDate);
      return matchesCategory && matchesSearch && matchesPrice && matchesStart && matchesEnd;
    });
  }, [selectedCategory, searchQuery, priceRange, startDate, endDate]);

  const dm = darkMode;

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 font-sans ${dm ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>

      {/* ── STYLES ── */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        input[type='range'] { -webkit-appearance: none; background: transparent; }
        input[type='range']::-webkit-slider-runnable-track {
          width: 100%; height: 6px; border-radius: 10px;
          background: linear-gradient(to right, #6366f1 ${(priceRange / 1000) * 100}%, ${dm ? '#1E0B3B' : '#f1f5f9'} ${(priceRange / 1000) * 100}%);
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%;
          background: #6366f1; cursor: pointer; margin-top: -7px;
          border: 3px solid ${dm ? '#0F0121' : 'white'};
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
        }
        .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0,0,0); }
        .ripple-btn:after {
          content: ""; display: block; position: absolute;
          width: 100%; height: 100%; top: 0; left: 0; pointer-events: none;
          background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
          background-repeat: no-repeat; background-position: 50%;
          transform: scale(10,10); opacity: 0;
          transition: transform .5s, opacity 1s;
        }
        .ripple-btn:active:after { transform: scale(0,0); opacity: .3; transition: 0s; }
      `}</style>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className={`w-72 border-r transition-all duration-500 flex flex-col sticky top-0 h-screen z-50 shrink-0 ${dm ? 'bg-[#0F0121] border-white/5' : 'bg-white border-slate-100'}`}>

        {/* Logo */}
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <TrendingUp size={26} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col">
            <span className={`text-2xl font-black tracking-tighter ${dm ? 'text-white' : 'text-indigo-600'}`}>
              Eventify
            </span>
            <span className={`text-xs font-bold ${dm ? 'text-slate-400' : 'text-indigo-400'}`}>
              Ticketing & Management
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-6 space-y-3 mt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30"
          >
            <LayoutDashboard size={20} /> Explore
          </button>
          <button
            onClick={() => navigate('/my-events')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Calendar size={20} /> My Events
          </button>
          <button
            onClick={() => navigate('/create-event')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <PlusSquare size={20} /> Create Event
          </button>
        </nav>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 min-w-0 px-10 py-10 relative overflow-x-hidden no-scrollbar">

        {/* ── TOP HEADER ── */}
        <header className="flex items-center justify-between mb-12 gap-6">

          {/* Search */}
          <div className="relative flex-1 max-w-2xl group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              placeholder="Search for events, artists, or venues..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-[24px] shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none font-bold text-sm transition-all ${dm ? 'bg-[#1E0B3B] border-none text-white placeholder:text-slate-500' : 'bg-white border border-slate-200 text-slate-900'}`}
            />
          </div>

          {/* Bell + User */}
          <div className="flex items-center gap-4 shrink-0 relative">

            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className={`p-3.5 rounded-[18px] ripple-btn shadow-sm transition-all ${showNotif ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : dm ? 'bg-[#1E0B3B] text-slate-300 hover:bg-white/5' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
              >
                <Bell size={20} />
              </button>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-md">
                3
              </span>

              {/* Notifications panel */}
              {showNotif && (
                <div className={`absolute top-14 right-0 w-[380px] rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] z-[100] border ${dm ? 'bg-[#1E0B3B] border-white/10' : 'bg-white border-slate-100'}`}>
                  <div className="p-7">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h2 className={`text-xl font-black ${dm ? 'text-white' : 'text-slate-900'}`}>Notifications</h2>
                        <p className="text-slate-500 font-bold text-xs mt-0.5">Stay updated</p>
                      </div>
                      <button className="text-indigo-600 font-black text-xs hover:underline">Mark all read</button>
                    </div>
                    <div className="space-y-3 max-h-[380px] overflow-y-auto no-scrollbar">
                      {NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 rounded-[20px] border flex gap-4 cursor-pointer hover:translate-x-1 transition-all ${dm ? 'bg-[#0F0121] border-white/5 hover:bg-white/5' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-100'}`}
                        >
                          <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-white shrink-0 ${n.color}`}>
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className={`font-black text-sm leading-tight ${dm ? 'text-white' : 'text-slate-900'}`}>{n.title}</h4>
                              {n.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1 shrink-0" />}
                            </div>
                            <p className="text-slate-500 text-xs font-medium mt-1 leading-relaxed">{n.desc}</p>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1.5 block">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User */}
            {user ? (
              <div
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-3 pl-4 border-l-2 cursor-pointer group ${dm ? 'border-white/5' : 'border-slate-100'}`}
              >
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-black group-hover:text-indigo-500 transition-colors ${dm ? 'text-white' : 'text-slate-900'}`}>
                    {user.fullName}
                  </p>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Member</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                Login
              </button>
            )}
          </div>
        </header>

        {/* ── FEATURED EVENTS ── */}
        <section className="mb-14">
          <div className="flex items-center gap-6 mb-8">
            <h3 className={`text-xs font-black uppercase tracking-[0.4em] shrink-0 ${dm ? 'text-slate-500' : 'text-slate-400'}`}>
              Handpicked For You
            </h3>
            <div className={`h-px flex-1 ${dm ? 'bg-white/5' : 'bg-slate-200'}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {FEATURED_EVENTS.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="relative group h-[360px] rounded-[36px] overflow-hidden shadow-xl cursor-pointer"
              >
                <img
                  src={event.image}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                  alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0121] via-[#0F0121]/30 to-transparent" />

                {/* Featured badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-lg border border-white/20 z-10">
                  <Sparkles size={12} className="text-white animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">Featured</span>
                </div>

                {/* Info */}
                <div className="absolute bottom-7 left-7 right-7 text-white">
                  <h4 className="text-xl font-black mb-2 leading-tight">{event.title}</h4>
                  <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold mb-4">
                    <MapPin size={13} className="text-indigo-400" />
                    {event.location}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[9px] uppercase font-black text-indigo-400 tracking-widest">From</p>
                      <span className="text-2xl font-black">${event.price}</span>
                    </div>
                    <button className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-all ripple-btn ${dm ? 'bg-white/10 backdrop-blur-md text-white hover:bg-indigo-600' : 'bg-white text-slate-900 hover:bg-indigo-600 hover:text-white'}`}>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DISCOVER SECTION ── */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className={`text-2xl font-black tracking-tight ${dm ? 'text-white' : 'text-slate-900'}`}>
              Discover Events
            </h2>
            <p className={`font-bold mt-1 text-sm ${dm ? 'text-slate-400' : 'text-slate-500'}`}>
              Browse experiences happening near you
            </p>
          </div>

          {/* Categories row */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3.5 rounded-2xl shadow-sm transition-all ripple-btn shrink-0 ${showFilters ? 'bg-indigo-600 text-white shadow-indigo-600/30' : dm ? 'bg-[#1E0B3B] text-slate-400' : 'bg-white text-slate-400 border border-slate-100'}`}
            >
              {showFilters ? <X size={18} /> : <Filter size={18} />}
            </button>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 py-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ripple-btn ${selectedCategory === cat ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : dm ? "bg-[#1E0B3B] text-slate-400 hover:text-white" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className={`p-7 rounded-[28px] grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 ${dm ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-100 shadow-sm'}`}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">Date Range</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`flex-1 p-3 rounded-xl outline-none font-bold text-sm border ${dm ? 'bg-[#0F0121] text-white border-white/5' : 'bg-slate-50 text-slate-900 border-slate-200'}`}
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`flex-1 p-3 rounded-xl outline-none font-bold text-sm border ${dm ? 'bg-[#0F0121] text-white border-white/5' : 'bg-slate-50 text-slate-900 border-slate-200'}`}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em]">Price Cap</label>
                  <span className="text-indigo-400 font-black text-sm">${priceRange}</span>
                </div>
                <input
                  type="range" min="0" max="1000" value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full cursor-pointer h-2 bg-indigo-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => { setPriceRange(1000); setStartDate(""); setEndDate(""); setSelectedCategory("All"); setSearchQuery(""); }}
                    className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400"
                  >
                    Clear All
                  </button>
                  <span className="text-[10px] font-bold text-slate-400">$0 — $1000</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── UPCOMING EVENTS GRID ── */}
        <section className="pb-32">
          <div className="flex items-center justify-between mb-7">
            <h3 className={`text-lg font-black tracking-tight ${dm ? 'text-white' : 'text-slate-900'}`}>
              Upcoming Experiences
            </h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-500/5 px-3 py-1.5 rounded-full">
              {filteredEvents.length} Events
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-20 rounded-[32px] ${dm ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-100'}`}>
              <SearchX size={40} className="text-slate-400 mb-3" />
              <p className={`text-base font-black ${dm ? 'text-white' : 'text-slate-900'}`}>No events found</p>
              <p className="text-slate-500 font-medium mt-1 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className={`group rounded-[32px] p-4 transition-all duration-500 cursor-pointer hover:-translate-y-2 ${dm ? 'bg-[#1E0B3B] hover:shadow-[0_40px_80px_-15px_rgba(99,102,241,0.15)]' : 'bg-white border border-slate-100 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.08)]'}`}
                >
                  {/* Image */}
                  <div className="relative h-52 rounded-[22px] overflow-hidden mb-5">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl backdrop-blur-xl border border-white/20 shadow-lg ${dm ? 'bg-[#0F0121]/80 text-white' : 'bg-white/90 text-slate-900'}`}>
                      <span className="font-black text-sm">${event.price}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-1 pb-1">
                    <span className="text-[10px] font-black uppercase text-indigo-500 px-3 py-1 bg-indigo-500/10 rounded-lg tracking-widest">
                      {event.category}
                    </span>
                    <h4 className={`text-base font-black mt-3 mb-4 group-hover:text-indigo-500 transition-colors leading-snug ${dm ? 'text-white' : 'text-slate-900'}`}>
                      {event.title}
                    </h4>
                    <div className={`flex items-center justify-between pt-3 border-t ${dm ? 'border-white/5' : 'border-slate-100'}`}>
                      <span className="font-bold text-[11px] flex items-center gap-1.5 text-slate-400">
                        <Calendar size={14} /> {event.date}
                      </span>
                      <button className="text-indigo-600 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 hover:gap-3 transition-all">
                        Buy Now <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════ CHAT WIDGET ══════════════ */}
        <div className="fixed bottom-10 left-10 z-[100] flex flex-col items-start">

          {isChatOpen && (
            <div className={`w-[360px] h-[580px] mb-5 rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border backdrop-blur-3xl ${dm ? 'bg-[#120626]/95 border-white/10' : 'bg-white/95 border-slate-200'}`}>

              {/* Chat header */}
              <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-7 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-11 h-11 bg-white/20 rounded-xl backdrop-blur-xl flex items-center justify-center border border-white/30">
                      <Sparkles className="text-white" size={20} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-indigo-700 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm">Eventify AI</h4>
                    <p className="text-indigo-100/70 font-bold text-[10px] uppercase tracking-widest">Always active</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"><Settings size={15} /></button>
                  <button onClick={() => setIsChatOpen(false)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-rose-500 transition-all"><X size={15} /></button>
                </div>
              </div>

              {/* Chat body */}
              <div className="flex-1 p-7 overflow-y-auto no-scrollbar flex flex-col items-center justify-center text-center space-y-5">
                <div className="relative">
                  <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl" />
                  <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative z-10">
                    <div className="w-14 h-14 border-2 border-white/20 rounded-full animate-[spin_8s_linear_infinite] flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className={`text-xl font-black mb-1.5 ${dm ? 'text-white' : 'text-slate-900'}`}>How can I help?</h3>
                  <p className="text-slate-500 font-medium max-w-[200px] leading-relaxed mx-auto text-sm">
                    Discover events or get help with ticket booking.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-[240px]">
                  {['Find Music', 'My Tickets'].map((btn) => (
                    <button key={btn} className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${dm ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>
                      {btn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat input */}
              <div className={`p-5 border-t ${dm ? 'border-white/5 bg-[#0A0318]/50' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-[1.8rem] border transition-all ${dm ? 'bg-[#1E0B3B] border-white/10 focus-within:border-indigo-500' : 'bg-white border-slate-200 focus-within:border-indigo-400'}`}>
                  <Paperclip size={16} className="text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors" />
                  <input
                    type="text"
                    placeholder="Message AI..."
                    className="bg-transparent flex-1 outline-none text-sm font-medium py-1"
                  />
                  <button className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-[1rem] flex items-center justify-center text-white shadow-md active:scale-95 transition-all">
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="w-18 h-18 w-[72px] h-[72px] bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1.8rem] flex items-center justify-center text-white shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] hover:scale-110 active:scale-90 transition-all ripple-btn border-4 border-white/10"
          >
            {isChatOpen ? <X size={28} strokeWidth={2.5} /> : <MessageCircle size={28} strokeWidth={2.5} />}
          </button>
        </div>

      </main>
    </div>
  );
}