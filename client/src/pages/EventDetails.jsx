import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { 
  Calendar, Clock, MapPin, Users, ArrowLeft, Heart, Share2, Moon, Sun, Bell, 
  Ticket, X, ChevronLeft, PartyPopper, TrendingUp, MessageCircle, Info, MoreHorizontal, LayoutDashboard, PlusSquare
} from "lucide-react";

// Professional Industrial Data
const ALL_EVENTS = [
  { id: 1, title: "Summer Music Festival 2026", price: 89, date: "Monday, June 15, 2026", location: "Golden Gate Park, San Francisco", category: "Music", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070", description: "Experience the ultimate summer music festival featuring top artists from around the world. Three days of non-stop music, food, and celebration in the heart of San Francisco. Join thousands of music lovers for an unforgettable experience." },
];

const NOTIFICATIONS = [
  { id: 1, title: "Event Starting Soon", desc: "Summer Music Festival starts in 2 hours", time: "2 hours ago", color: "bg-indigo-600", icon: <Calendar size={20}/>, unread: true },
  { id: 2, title: "Registration Confirmed", desc: "Your ticket for Tech Summit 2026 is confirmed", time: "5 hours ago", color: "bg-blue-600", icon: <Ticket size={20}/>, unread: true },
  { id: 3, title: "Event Update", desc: "New speaker added to AI Conference", time: "1 day ago", color: "bg-orange-500", icon: <Bell size={20}/>, unread: false },
  { id: 4, title: "Event Success", desc: "Your event 'Startup Meetup' reached 100 attendees!", time: "2 days ago", color: "bg-emerald-500", icon: <PartyPopper size={20}/>, unread: false },
];

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [showNotif, setShowNotif] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const event = ALL_EVENTS.find(e => e.id === parseInt(id)) || ALL_EVENTS[0];
  if (!event) return <div className="p-20 text-center font-black text-2xl">Event Not Found</div>;

  return (
    <div className={`flex min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); } .ripple-btn:after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10, 10); opacity: 0; transition: transform .5s, opacity 1s; } .ripple-btn:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }`}</style>
      
      <aside className={`w-72 border-r transition-all duration-500 flex flex-col sticky top-0 h-screen z-50 ${darkMode ? 'bg-[#0F0121] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20"><TrendingUp size={26} strokeWidth={2.5} /></div>
          <span className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-indigo-600'}`}>Eventify</span>
        </div>
        <nav className="flex-1 px-6 space-y-3 mt-8">
          <button onClick={() => navigate('/')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><LayoutDashboard size={20} /> Explore</button>
          <button onClick={() => navigate('/my-events')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><Calendar size={20} /> My Events</button>
          <button onClick={() => navigate('/create-event')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><PlusSquare size={20} /> Create Event</button>
        </nav>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="px-12 py-8 flex justify-between items-center max-w-[1600px] mx-auto sticky top-0 z-[60] backdrop-blur-md">
          <button onClick={() => navigate('/')} className={`flex items-center gap-3 px-8 py-4 rounded-[22px] font-black text-sm shadow-sm transition-all ripple-btn ${darkMode ? 'bg-white/5 text-white border border-white/10' : 'bg-white text-slate-600 border border-slate-100'}`}>
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </button>
          <div className="flex items-center gap-5 relative">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-4 rounded-[22px] ripple-btn shadow-sm transition-all duration-500 flex items-center justify-center ${darkMode ? 'bg-[#1E0B3B] text-yellow-400' : 'bg-white border border-slate-100 text-slate-600'}`}><Sun size={24} /></button>
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className={`p-4 rounded-[22px] ripple-btn shadow-sm transition-all flex items-center justify-center ${showNotif ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : darkMode ? 'bg-[#1E0B3B] text-slate-300' : 'bg-white border text-slate-600'}`}><Bell size={24} /></button>
              {showNotif && (
                <div className={`absolute top-20 right-0 w-[450px] rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] z-[100] border transition-all animate-in fade-in zoom-in-95 duration-300 ${darkMode ? 'bg-[#1E0B3B] border-white/10' : 'bg-white border-slate-100'}`}>
                  <div className="p-10">
                    <button onClick={() => setShowNotif(false)} className="flex items-center gap-2 text-slate-500 mb-6 font-black text-xs uppercase tracking-widest hover:text-indigo-500"><ChevronLeft size={16}/> Back</button>
                    <div className="flex justify-between items-end mb-10"><div><h2 className="text-3xl font-black tracking-tight">Notifications</h2><p className="text-slate-500 font-bold mt-1">Stay updated</p></div><button className="text-indigo-600 font-black text-sm hover:underline">Mark all read</button></div>
                    <div className="space-y-5 max-h-[450px] overflow-y-auto no-scrollbar pr-2 text-left">
                      {NOTIFICATIONS.map((n) => (
                        <div key={n.id} className={`p-7 rounded-[32px] border flex gap-6 transition-all cursor-pointer ${darkMode ? 'bg-[#0F0121] border-white/5 hover:bg-white/5' : 'bg-[#F8FAFC] border-slate-100'}`}>
                          <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-white shrink-0 shadow-lg ${n.color}`}>{n.icon}</div>
                          <div className="flex-1"><div className="flex justify-between"><h4 className="font-black text-base">{n.title}</h4>{n.unread && <div className="w-3 h-3 bg-indigo-600 rounded-full mt-1.5" />}</div><p className="text-slate-500 text-[13px] font-bold mt-1.5">{n.desc}</p><span className="text-slate-400 text-[10px] font-black uppercase mt-4 block">{n.time}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-5 ml-4 pl-6 border-l-2 border-slate-100 dark:border-white/5">
              <div className="text-right hidden sm:block"><p className="text-base font-black">Alex Johnson</p><p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">Premium Member</p></div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-indigo-600/30">AJ</div>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-12 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-12">
              <div className="relative rounded-[60px] overflow-hidden shadow-3xl">
                <img src={event.image} className="w-full h-[550px] object-cover" alt="" />
                <div className="absolute bottom-10 left-10"><div className="bg-[#0F0121]/80 backdrop-blur-xl px-10 py-5 rounded-[30px] text-white font-black text-xl border border-white/10 shadow-2xl">Starts in 109d 4h</div></div>
              </div>
              <div className="space-y-6">
                <span className="px-6 py-2 bg-indigo-500/10 text-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest">{event.category}</span>
                <h1 className="text-7xl font-black tracking-tighter leading-[0.9]">{event.title}</h1>
                <div className={`p-12 rounded-[56px] shadow-sm ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-100'}`}>
                  <h3 className="text-3xl font-black mb-8 flex items-center gap-4"><Info className="text-indigo-500" /> About Event</h3>
                  <p className="text-xl font-bold text-slate-400 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-10">
              <div className={`p-12 rounded-[56px] shadow-3xl sticky top-32 ${darkMode ? 'bg-[#1E0B3B] border-white/5' : 'bg-white border border-slate-50'}`}>
                <h3 className="text-3xl font-black mb-12 tracking-tight">Booking Details</h3>
                <div className="space-y-10">
                  <DetailItem icon={<Calendar />} label="Date" value={event.date} darkMode={darkMode} />
                  <DetailItem icon={<Clock />} label="Time" value="18:00" darkMode={darkMode} />
                  <DetailItem icon={<MapPin />} label="Location" value={event.location} darkMode={darkMode} />
                  <DetailItem icon={<Users />} label="Attendees" value="2547+ going" darkMode={darkMode} />
                </div>
                <button onClick={() => setIsBooked(!isBooked)} className={`w-full mt-12 py-7 rounded-[32px] font-black text-2xl transition-all ripple-btn ${isBooked ? 'bg-emerald-500' : 'bg-indigo-600'} text-white shadow-2xl shadow-indigo-600/20`}>
                  {isBooked ? 'Ticket Reserved' : 'Reserve Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailItem({ icon, label, value, darkMode }) {
  return (
    <div className="flex items-center gap-8">
      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-indigo-500 ${darkMode ? 'bg-[#0F0121]' : 'bg-indigo-50'}`}>{React.cloneElement(icon, { size: 28 })}</div>
      <div>
        <p className="text-[11px] uppercase font-black text-slate-400 tracking-widest mb-1.5">{label}</p>
        <p className="font-black text-lg tracking-tight">{value}</p>
      </div>
    </div>
  );
}