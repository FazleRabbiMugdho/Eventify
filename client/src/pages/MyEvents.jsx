import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { Calendar, MapPin, Users, DollarSign, Eye, TrendingUp, ChevronLeft, Moon, Sun, Bell, LayoutDashboard, PlusSquare, MoreVertical, Filter, ArrowUpRight } from "lucide-react";
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';

const STATS = [
  { id: 1, label: "Total Events", value: "12", icon: <TrendingUp size={24} />, color: "bg-gradient-to-br from-indigo-600 to-blue-500", textColor: "text-white" },
  { id: 2, label: "Total Attendees", value: "2,847", icon: <Users size={24} />, color: "bg-white", textColor: "text-slate-900" },
  { id: 3, label: "Total Revenue", value: "$18,420", icon: <DollarSign size={24} />, color: "bg-white", textColor: "text-slate-900" },
  { id: 4, label: "Total Views", value: "15,634", icon: <Eye size={24} />, color: "bg-white", textColor: "text-slate-900" },
];

const HOSTED_EVENTS = [
  { id: 1, title: "Summer Music Festival 2026", image: img1, date: "Jun 15", location: "Golden Gate Park, San Francisco", attendees: "2547+", revenue: "$226,683", growth: "+15%", category: "Music", price: "$89", organizer: "Music Collective" },
  { id: 2, title: "Tech Summit 2026", image: img2, date: "Jul 22", location: "Moscone Center, San Francisco", attendees: "1847+", revenue: "$552,253", growth: "+15%", category: "Tech", price: "$299", organizer: "Tech Innovators" },
  { id: 3, title: "Business Networking Mixer", image: img3, date: "May 10", location: "The Ritz-Carlton, San Francisco", attendees: "324+", revenue: "$14,580", growth: "+15%", category: "Business", price: "$45", organizer: "BizConnect" },
];

export default function MyEvents() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("hosting");

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 font-sans ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); } .ripple-btn:after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10, 10); opacity: 0; transition: transform .5s, opacity 1s; } .ripple-btn:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }`}</style>
      
      <aside className={`w-72 border-r transition-all duration-500 flex flex-col sticky top-0 h-screen z-50 shrink-0 ${darkMode ? 'bg-[#0F0121] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20"><TrendingUp size={26} strokeWidth={2.5} /></div>
          <span className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-indigo-600'}`}>Eventify</span>
        </div>
        <nav className="flex-1 px-6 space-y-3 mt-8">
          <button onClick={() => navigate('/')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><LayoutDashboard size={20} /> Explore</button>
          <button className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30`}><Calendar size={20} /> My Events</button>
          <button onClick={() => navigate('/create-event')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><PlusSquare size={20} /> Create Event</button>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-12 py-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div><h1 className="text-5xl font-black tracking-tighter">My Events</h1><p className="text-slate-500 font-bold mt-2">Manage and track your hosting performance</p></div>
          <div className="flex items-center gap-5">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-4 rounded-[22px] ripple-btn shadow-sm transition-all ${darkMode ? 'bg-[#1E0B3B] text-yellow-400' : 'bg-white border border-slate-100 text-slate-600'}`}>{darkMode ? <Sun size={24} /> : <Moon size={24} />}</button>
            <div className={`flex items-center gap-5 ml-4 pl-6 border-l-2 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <div className="text-right hidden sm:block"><p className="text-base font-black">Alex Johnson</p><p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Premium Member</p></div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-indigo-600/30">AJ</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {STATS.map((stat) => (
            <div key={stat.id} className={`p-8 rounded-[40px] shadow-3xl border transition-all hover:-translate-y-2 ${stat.color} ${darkMode && stat.id !== 1 ? 'bg-[#1E0B3B] border-white/5' : !darkMode && stat.id !== 1 ? 'bg-white border-slate-100' : 'border-transparent'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${stat.id === 1 ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>{stat.icon}</div>
              <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${stat.id === 1 ? 'text-indigo-100' : 'text-slate-400'}`}>{stat.label}</p>
              <h3 className={`text-4xl font-black ${stat.id === 1 ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className={`inline-flex p-2 rounded-[30px] mb-12 ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white shadow-sm border border-slate-100'}`}>
          <button onClick={() => setActiveTab("hosting")} className={`px-10 py-4 rounded-[24px] font-black text-sm transition-all ${activeTab === "hosting" ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-indigo-500'}`}>Events I'm Hosting</button>
          <button onClick={() => setActiveTab("attending")} className={`px-10 py-4 rounded-[24px] font-black text-sm transition-all ${activeTab === "attending" ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-indigo-500'}`}>Events I'm Attending</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-20">
          {HOSTED_EVENTS.map((event) => (
            <div key={event.id} className={`group rounded-[48px] overflow-hidden transition-all duration-500 border ${darkMode ? 'bg-[#1E0B3B] border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200'}`}>
              <div className="relative h-64">
                <img src={event.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-5 left-5 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest">{event.category}</div>
                <div className="absolute top-5 right-5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-lg">{event.price}</div>
                <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white font-black text-xs"><Calendar size={14} className="text-indigo-400" /> {event.date}</div>
              </div>
              <div className="p-10">
                <h4 className="text-xl font-black mb-4 tracking-tight leading-tight group-hover:text-indigo-500 transition-colors">{event.title}</h4>
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-6"><MapPin size={14} /> {event.location}</div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden flex items-center justify-center text-slate-500"><Users size={16} /></div>
                  <span className="text-xs font-black text-slate-400">{event.attendees} attending</span>
                </div>
                <div className={`pt-8 border-t flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest"><TrendingUp size={12} /> {event.growth} growth</div>
                    <div className="text-2xl font-black mt-1 text-emerald-500">{event.revenue}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white ${event.id === 1 ? 'bg-indigo-500' : event.id === 2 ? 'bg-blue-500' : 'bg-purple-500'}`}>{event.organizer.charAt(0)}</div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{event.organizer}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="fixed bottom-12 right-12 z-[100]">
        <button className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:scale-110 active:scale-90 transition-all ripple-btn">
          <TrendingUp size={32} strokeWidth={2.5} className="rotate-45" />
        </button>
      </div>
    </div>
  );
}