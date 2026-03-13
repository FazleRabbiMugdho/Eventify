import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";
import {
  Calendar, Clock, MapPin, Users, ArrowLeft, Sun, Bell,
  Ticket, ChevronLeft, PartyPopper, TrendingUp, Info,
  LayoutDashboard, PlusSquare, CheckCircle
} from "lucide-react";

// ── DATA ────────────────────────────────────────────────────
const ALL_EVENTS = [
  {
    id: 1,
    title: "Summer Music Festival 2026",
    price: 89,
    date: "Monday, June 15, 2026",
    time: "6:00 PM",
    location: "Golden Gate Park, San Francisco",
    category: "Music",
    attendees: "2,547+ going",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070",
    description:
      "Experience the ultimate summer music festival featuring top artists from around the world. Three days of non-stop music, food, and celebration in the heart of San Francisco. Join thousands of music lovers for an unforgettable experience.",
  },
];

const NOTIFICATIONS = [
  { id: 1, title: "Event Starting Soon", desc: "Summer Music Festival starts in 2 hours", time: "2 hours ago", color: "bg-indigo-600", icon: <Calendar size={18} />, unread: true },
  { id: 2, title: "Registration Confirmed", desc: "Your ticket for Tech Summit 2026 is confirmed", time: "5 hours ago", color: "bg-blue-600", icon: <Ticket size={18} />, unread: true },
  { id: 3, title: "Event Update", desc: "New speaker added to AI Conference", time: "1 day ago", color: "bg-orange-500", icon: <Bell size={18} />, unread: false },
  { id: 4, title: "Event Success", desc: "Your event 'Startup Meetup' reached 100 attendees!", time: "2 days ago", color: "bg-emerald-500", icon: <PartyPopper size={18} />, unread: false },
];

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const event = ALL_EVENTS.find(e => e.id === parseInt(id)) || ALL_EVENTS[0];
  if (!event) return (
    <div className="p-20 text-center font-black text-2xl">Event Not Found</div>
  );

  const dm = darkMode;

  return (
    <div className={`flex min-h-screen transition-colors duration-500 font-sans ${dm ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>

      {/* ── STYLES ── */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
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
          <span className={`text-2xl font-black tracking-tighter ${dm ? 'text-white' : 'text-indigo-600'}`}>
            Eventify
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-6 space-y-3 mt-8">
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn ${dm ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} /> Explore
          </button>
          <button
            onClick={() => navigate('/my-events')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn ${dm ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Calendar size={20} /> My Events
          </button>
          <button
            onClick={() => navigate('/create-event')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn ${dm ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <PlusSquare size={20} /> Create Event
          </button>
        </nav>
      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <main className="flex-1 overflow-x-hidden no-scrollbar">

        {/* ── HEADER ── */}
        <header className={`px-10 py-5 flex justify-between items-center sticky top-0 z-[60] backdrop-blur-md border-b ${dm ? 'border-white/5' : 'border-slate-100'}`}>

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm shadow-sm transition-all ripple-btn ${dm ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Back
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-3 relative">

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!dm)}
              className={`p-3 rounded-2xl ripple-btn shadow-sm transition-all ${dm ? 'bg-[#1E0B3B] text-yellow-400' : 'bg-white border border-slate-100 text-slate-600'}`}
            >
              <Sun size={20} />
            </button>

            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className={`p-3 rounded-2xl ripple-btn shadow-sm transition-all ${showNotif ? 'bg-indigo-600 text-white' : dm ? 'bg-[#1E0B3B] text-slate-300' : 'bg-white border border-slate-100 text-slate-600'}`}
              >
                <Bell size={20} />
              </button>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">
                3
              </span>

              {/* Notifications panel */}
              {showNotif && (
                <div className={`absolute top-14 right-0 w-[360px] rounded-[28px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] z-[100] border ${dm ? 'bg-[#1E0B3B] border-white/10' : 'bg-white border-slate-100'}`}>
                  <div className="p-6">

                    {/* Panel header */}
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h2 className={`text-lg font-black ${dm ? 'text-white' : 'text-slate-900'}`}>Notifications</h2>
                        <p className="text-slate-500 text-xs font-medium mt-0.5">Stay updated</p>
                      </div>
                      <button className="text-indigo-600 font-black text-xs hover:underline">
                        Mark all read
                      </button>
                    </div>

                    {/* Notification list */}
                    <div className="space-y-3 max-h-[340px] overflow-y-auto no-scrollbar">
                      {NOTIFICATIONS.map((n) => (
                        <div
                          key={n.id}
                          className={`p-4 rounded-[18px] border flex gap-4 cursor-pointer hover:translate-x-1 transition-all ${dm ? 'bg-[#0F0121] border-white/5 hover:bg-white/5' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}
                        >
                          <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-white shrink-0 ${n.color}`}>
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className={`font-black text-sm leading-tight ${dm ? 'text-white' : 'text-slate-900'}`}>
                                {n.title}
                              </h4>
                              {n.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full shrink-0 mt-1" />}
                            </div>
                            <p className="text-slate-500 text-xs font-medium mt-1 leading-snug">{n.desc}</p>
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-1.5 block">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User avatar / Login */}
            {user ? (
              <div
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-3 pl-3 border-l-2 cursor-pointer group ${dm ? 'border-white/5' : 'border-slate-100'}`}
              >
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-black group-hover:text-indigo-500 transition-colors ${dm ? 'text-white' : 'text-slate-900'}`}>
                    {user.fullName}
                  </p>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Member</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : 'U'}
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

        {/* ── PAGE CONTENT ── */}
        <div className="px-10 py-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-8 space-y-8">

              {/* Hero image */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                <img
                  src={event.image}
                  className="w-full h-[420px] object-cover"
                  alt={event.title}
                />

                {/* Countdown pill */}
                <div className="absolute bottom-6 left-6">
                  <div className="bg-[#0F0121]/75 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-white font-black text-sm border border-white/10 shadow-xl">
                    ⏱ Starts in 109d 4h
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* Title + About */}
              <div className="space-y-5">

                {/* Event title */}
                <h1 className={`text-4xl font-black tracking-tight leading-tight ${dm ? 'text-white' : 'text-slate-900'}`}>
                  {event.title}
                </h1>

                {/* About section */}
                <div className={`p-7 rounded-[24px] ${dm ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-100 shadow-sm'}`}>
                  <h3 className={`text-lg font-black mb-4 flex items-center gap-3 ${dm ? 'text-white' : 'text-slate-900'}`}>
                    <Info size={20} className="text-indigo-500" />
                    About this Event
                  </h3>
                  <p className={`text-sm font-medium leading-relaxed ${dm ? 'text-slate-400' : 'text-slate-600'}`}>
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (Booking card) ── */}
            <div className="lg:col-span-4">
              <div className={`p-7 rounded-[28px] sticky top-24 ${dm ? 'bg-[#1E0B3B] border border-white/5' : 'bg-white border border-slate-100 shadow-md'}`}>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                    Starting from
                  </p>
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-black ${dm ? 'text-white' : 'text-slate-900'}`}>
                      ${event.price}
                    </span>
                    <span className="text-slate-400 font-bold text-sm mb-1">/ person</span>
                  </div>
                </div>

                {/* Divider */}
                <div className={`h-px mb-6 ${dm ? 'bg-white/5' : 'bg-slate-100'}`} />

                {/* Detail items */}
                <h3 className={`text-sm font-black uppercase tracking-widest mb-5 ${dm ? 'text-slate-400' : 'text-slate-400'}`}>
                  Event Details
                </h3>

                <div className="space-y-5 mb-7">
                  <DetailItem icon={<Calendar />} label="Date" value={event.date} dm={dm} />
                  <DetailItem icon={<Clock />} label="Time" value={event.time} dm={dm} />
                  <DetailItem icon={<MapPin />} label="Location" value={event.location} dm={dm} />
                  <DetailItem icon={<Users />} label="Attendees" value={event.attendees} dm={dm} />
                </div>

                {/* Divider */}
                <div className={`h-px mb-6 ${dm ? 'bg-white/5' : 'bg-slate-100'}`} />

                {/* Reserve button */}
                <button
                  onClick={() => setIsBooked(!isBooked)}
                  className={`w-full py-4 rounded-2xl font-black text-base transition-all ripple-btn active:scale-95 shadow-lg flex items-center justify-center gap-2 ${isBooked ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'}`}
                >
                  {isBooked ? (
                    <><CheckCircle size={20} /> Ticket Reserved</>
                  ) : (
                    <><Ticket size={20} /> Reserve Ticket</>
                  )}
                </button>

                {/* Trust note */}
                <p className="text-center text-xs text-slate-400 font-medium mt-3">
                  Free cancellation up to 48hrs before
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// ── DETAIL ITEM COMPONENT ────────────────────────────────────
function DetailItem({ icon, label, value, dm }) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 ${dm ? 'bg-[#0F0121]' : 'bg-indigo-50'}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">
          {label}
        </p>
        <p className={`font-bold text-sm leading-snug ${dm ? 'text-white' : 'text-slate-800'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}