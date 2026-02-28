import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { 
  LayoutDashboard, Calendar, PlusSquare, Search, Bell, Moon, Sun, MapPin, ArrowRight, TrendingUp, Filter, X,
  SearchX, MessageCircle, Send, Paperclip, Mic, BellDot, Zap, CheckCircle, Ticket, PartyPopper, ChevronLeft, Settings, LogOut, Sparkles, MoreHorizontal
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
  { id: 1, title: "Event Starting Soon", desc: "Summer Music Festival starts in 2 hours", time: "2 hours ago", color: "bg-indigo-600", icon: <Calendar size={20}/>, unread: true },
  { id: 2, title: "Registration Confirmed", desc: "Your ticket for Tech Summit 2026 is confirmed", time: "5 hours ago", color: "bg-blue-600", icon: <Ticket size={20}/>, unread: true },
  { id: 3, title: "Event Update", desc: "New speaker added to AI Conference", time: "1 day ago", color: "bg-orange-500", icon: <Bell size={20}/>, unread: false },
  { id: 4, title: "Event Success", desc: "Your event 'Startup Meetup' reached 100 attendees!", time: "2 days ago", color: "bg-emerald-500", icon: <PartyPopper size={20}/>, unread: false },
];

export default function Eventpage() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
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

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 font-sans ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } input[type='range'] { -webkit-appearance: none; background: transparent; } input[type='range']::-webkit-slider-runnable-track { width: 100%; height: 6px; background: linear-gradient(to right, #6366f1 ${ (priceRange / 1000) * 100 }%, ${darkMode ? '#1E0B3B' : '#f1f5f9'} ${ (priceRange / 1000) * 100 }%); border-radius: 10px; } input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #6366f1; cursor: pointer; margin-top: -7px; border: 3px solid ${darkMode ? '#0F0121' : 'white'}; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3); } .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); } .ripple-btn:after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10, 10); opacity: 0; transition: transform .5s, opacity 1s; } .ripple-btn:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }`}</style>

      <aside className={`w-72 border-r transition-all duration-500 flex flex-col sticky top-0 h-screen z-50 shrink-0 ${darkMode ? 'bg-[#0F0121] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="p-8 flex items-center gap-4"><div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20"><TrendingUp size={26} strokeWidth={2.5} /></div><span className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-indigo-600'}`}>Eventify</span></div>
        <nav className="flex-1 px-6 space-y-3 mt-8">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30"><LayoutDashboard size={20} /> Explore</button>
          <button onClick={() => navigate('/my-events')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><Calendar size={20} /> My Events</button>
          <button onClick={() => navigate('/create-event')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><PlusSquare size={20} /> Create Event</button>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-12 py-10 relative overflow-x-hidden no-scrollbar">
        <header className="flex items-center justify-between mb-12 gap-10 max-w-full mx-auto">
          <div className="relative flex-1 max-w-3xl group"><Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} /><input type="text" value={searchQuery} placeholder="Search for events, artists, or venues..." onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-20 pr-10 py-5 rounded-[28px] shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none font-bold text-base transition-all ${darkMode ? 'bg-[#1E0B3B] border-none text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900'}`} /></div>
          <div className="flex items-center gap-5 relative">
            <div className="relative"><button onClick={() => setShowNotif(!showNotif)} className={`p-4 rounded-[22px] ripple-btn shadow-sm transition-all flex items-center justify-center ${showNotif ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : darkMode ? 'bg-[#1E0B3B] text-slate-300 hover:bg-white/5' : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'}`}><Bell size={24} /></button><span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 text-white text-[11px] font-black flex items-center justify-center rounded-full border-[3px] border-white dark:border-[#0F0121] shadow-lg">3</span>
              {showNotif && (<div className={`absolute top-20 right-0 w-[450px] rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] z-[100] border transition-all animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-[#1E0B3B] border-white/10' : 'bg-white border-slate-100'}`}><div className="p-10"><button onClick={() => setShowNotif(false)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-black text-xs uppercase tracking-widest"><ChevronLeft size={16}/> Back</button><div className="flex justify-between items-end mb-10"><div><h2 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h2><p className="text-slate-500 font-bold mt-1">Stay updated</p></div><button className="text-indigo-600 font-black text-sm hover:underline underline-offset-4 decoration-2">Mark all read</button></div><div className="space-y-5 max-h-[480px] overflow-y-auto no-scrollbar pr-2">{NOTIFICATIONS.map((n) => (<div key={n.id} className={`p-7 rounded-[32px] border flex gap-6 transition-all cursor-pointer group hover:translate-x-2 ${darkMode ? 'bg-[#0F0121] border-white/5 hover:bg-white/5' : 'bg-[#F8FAFC] border-slate-100 shadow-sm hover:bg-white hover:border-indigo-100'}`}><div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-white shrink-0 shadow-2xl ${n.color}`}>{n.icon}</div><div className="flex-1"><div className="flex justify-between items-start"><h4 className={`font-black text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>{n.title}</h4>{n.unread && <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5 shadow-lg shadow-indigo-500" />}</div><p className="text-slate-500 text-[13px] font-bold mt-1.5 leading-relaxed">{n.desc}</p><span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 block">{n.time}</span></div></div>))}</div></div></div>)}
            </div>
            <div onClick={() => navigate('/profile')} className={`flex items-center gap-5 ml-4 pr-6 border-l-2 cursor-pointer group ${darkMode ? 'border-white/5' : 'border-slate-100'}`}><div className="text-right hidden sm:block"><p className={`text-base font-black group-hover:text-indigo-500 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>Alex Johnson</p><p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Premium Member</p></div><div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">AJ</div></div>
          </div>
        </header>

        <section className="mb-16 max-w-full"><div className="flex items-center justify-between mb-10"><h3 className={`text-xs font-black uppercase tracking-[0.4em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Handpicked For You</h3><div className={`h-[2px] flex-1 ml-10 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">{FEATURED_EVENTS.map((event) => (<div key={event.id} onClick={() => navigate(`/event/${event.id}`)} className="relative group h-[420px] rounded-[50px] overflow-hidden shadow-2xl cursor-pointer"><img src={event.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="" /><div className="absolute inset-0 bg-gradient-to-t from-[#0F0121] via-[#0F0121]/40 to-transparent" /><div className="absolute top-8 left-8 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-lg border border-white/20 z-10 animate-in fade-in zoom-in duration-700"><Sparkles size={14} className="text-white animate-pulse" /><span className="text-[11px] font-black uppercase text-white tracking-widest">Featured</span></div><div className="absolute bottom-10 left-10 right-10 text-white"><h4 className="text-3xl font-black mb-5 leading-tight tracking-tight">{event.title}</h4><div className="flex items-center justify-between pt-8 border-t border-white/10"><div><p className="text-[10px] uppercase font-black text-indigo-400 tracking-widest">Ticket Price</p><span className="text-3xl font-black">${event.price}</span></div><button className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all ripple-btn ${darkMode ? 'bg-white/10 backdrop-blur-md text-white hover:bg-indigo-600' : 'bg-white text-slate-950 hover:bg-indigo-600 hover:text-white'}`}><ArrowRight size={24} /></button></div></div></div>))}</div>
        </section>

        <section className="mb-14 max-w-full">
          <div className="mb-10"><h2 className={`text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Discover Events</h2><p className={`font-bold mt-2 text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Browse experiences happening near you</p></div>
          <div className="flex items-center gap-5 mb-8">
            <button onClick={() => setShowFilters(!showFilters)} className={`p-5 rounded-2xl shadow-lg transition-all ripple-btn ${showFilters ? 'bg-indigo-600 text-white shadow-indigo-600/30' : darkMode ? 'bg-[#1E0B3B] text-slate-400' : 'bg-white text-slate-400 border border-slate-100'}`}>{showFilters ? <X size={24} /> : <Filter size={24} />}</button>
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar flex-1 py-2">{CATEGORIES.map(cat => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap shadow-sm ripple-btn ${selectedCategory === cat ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : darkMode ? "bg-[#1E0B3B] text-slate-400 hover:text-white" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"}`}>{cat}</button>))}</div>
          </div>
          {showFilters && (<div className={`p-10 rounded-[48px] shadow-3xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 animate-in slide-in-from-top-4 duration-500 ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-100'}`}><div className="space-y-5"><label className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">Select Date Range</label><div className="flex gap-6"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`flex-1 p-4 rounded-2xl outline-none font-bold text-sm ${darkMode ? 'bg-[#0F0121] text-white border-white/5' : 'bg-slate-50 text-slate-900 border-slate-200'} border`} /><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`flex-1 p-4 rounded-2xl outline-none font-bold text-sm ${darkMode ? 'bg-[#0F0121] text-white border-white/5' : 'bg-slate-50 text-slate-900 border-slate-200'} border`} /></div></div><div className="space-y-5"><div className="flex justify-between items-center"><label className="text-[11px] font-black uppercase text-indigo-500 tracking-[0.2em]">Price Cap</label><span className="text-indigo-400 font-black text-lg">${priceRange}</span></div><input type="range" min="0" max="1000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full cursor-pointer h-2 bg-indigo-100 rounded-lg appearance-none" /><div className="flex justify-between items-center pt-2"><button onClick={() => {setPriceRange(1000); setStartDate(""); setEndDate(""); setSelectedCategory("All"); setSearchQuery("");}} className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400">Clear All Filters</button><span className="text-[10px] font-bold text-slate-400">0 - 1000 USD</span></div></div></div>)}
        </section>

        <section className="pb-32 max-w-full"><div className="flex items-center justify-between mb-10"><h3 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Upcoming Experiences</h3><span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-500/5 px-4 py-2 rounded-full">{filteredEvents.length} Events Available</span></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">{filteredEvents.map((event) => (<div key={event.id} onClick={() => navigate(`/event/${event.id}`)} className={`group rounded-[48px] p-5 transition-all duration-500 cursor-pointer hover:-translate-y-3 ${darkMode ? 'bg-[#1E0B3B] hover:shadow-[0_40px_80px_-15px_rgba(99,102,241,0.15)]' : 'bg-white border border-slate-50 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]'}`}><div className="relative h-72 rounded-[36px] overflow-hidden mb-8 shadow-inner"><img src={event.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" /><div className={`absolute top-5 right-5 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 ${darkMode ? 'bg-[#0F0121]/80 text-white' : 'bg-white/90 text-slate-900'}`}><span className="font-black text-base">${event.price}</span></div></div><div className="px-4 pb-4"><span className="text-[11px] font-black uppercase text-indigo-500 px-4 py-2 bg-indigo-500/10 rounded-xl tracking-widest">{event.category}</span><h4 className={`text-xl font-black mt-6 mb-8 group-hover:text-indigo-500 transition-colors tracking-tight leading-snug ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</h4><div className={`flex items-center justify-between pt-6 border-t-2 ${darkMode ? 'border-white/5' : 'border-slate-50'}`}><span className="font-black text-[12px] uppercase flex items-center gap-3 text-slate-400"><Calendar size={18} /> {event.date}</span><button className="text-indigo-600 font-black text-[13px] uppercase tracking-[0.1em] flex items-center gap-2 hover:gap-4 transition-all">Buy Now <ArrowRight size={18} /></button></div></div></div>))}</div>
        </section>

        <div className="fixed bottom-12 left-12 z-[100] flex flex-col items-start">
          {isChatOpen && (
            <div className={`w-[420px] h-[680px] mb-8 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transition-all duration-500 animate-in slide-in-from-left-12 border backdrop-blur-3xl ${darkMode ? 'bg-[#120626]/95 border-white/10' : 'bg-white/95 border-slate-200'}`}>
              <div className="bg-gradient-to-r from-indigo-700 to-violet-700 p-10 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-6"><div className="relative"><div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-inner"><Sparkles className="text-white" size={26} /></div><div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[4px] border-indigo-700 shadow-lg animate-pulse" /></div><div><h4 className="text-white font-black text-lg tracking-tight">Eventify AI</h4><p className="text-indigo-100/70 font-bold text-[11px] uppercase tracking-widest">Always active</p></div></div>
                <div className="flex gap-4"><button className="p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"><Settings size={18} /></button><button onClick={() => setIsChatOpen(false)} className="p-3 bg-white/10 rounded-xl text-white hover:bg-rose-500 transition-all"><X size={18} /></button></div>
              </div>
              <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-8 flex flex-col items-center justify-center text-center">
                <div className="relative group"><div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all" /><div className="w-36 h-36 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 relative z-10"><div className="w-20 h-20 border-2 border-white/20 rounded-full animate-[spin_8s_linear_infinite] flex items-center justify-center"><div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white]" /></div></div></div>
                <div><h3 className={`text-3xl font-black mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>How can I help?</h3><p className="text-slate-500 font-bold max-w-[240px] leading-relaxed mx-auto">Discover concerts, tech summits, or get help with your ticket booking instantly.</p></div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">{['Find Music', 'My Tickets'].map((btn) => (<button key={btn} className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest border transition-all ${darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>{btn}</button>))}</div>
              </div>
              <div className={`p-8 border-t ${darkMode ? 'border-white/5 bg-[#0A0318]/50' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className={`flex items-center gap-4 px-6 py-4 rounded-[2.5rem] shadow-2xl border transition-all ${darkMode ? 'bg-[#1E0B3B] border-white/10 focus-within:border-indigo-500' : 'bg-white border-slate-200 focus-within:border-indigo-400'}`}><Paperclip size={20} className="text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors" /><input type="text" placeholder="Message AI..." className="bg-transparent flex-1 outline-none text-[15px] font-bold py-2" /><button className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 active:scale-95 transition-all"><Send size={22} /></button></div>
              </div>
            </div>)}
          <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.5)] hover:scale-110 active:scale-90 transition-all ripple-btn border-4 border-white/10">{isChatOpen ? <X size={36} strokeWidth={2.5} /> : <MessageCircle size={36} strokeWidth={2.5} />}</button>
        </div>
      </main>
    </div>
  );
}