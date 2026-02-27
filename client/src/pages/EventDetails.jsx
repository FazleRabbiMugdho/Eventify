import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, Clock, MapPin, Users, ArrowLeft, Heart, Share2, Moon, Sun, Bell 
} from "lucide-react";

// Mock Data (In a real app, you'd fetch this from an API using the ID)
const ALL_EVENTS = [
  { id: 1, title: "Summer Music Festival 2026", price: 89, date: "Monday, June 15, 2026", location: "Golden Gate Park, San Francisco", category: "Music", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070" },
  // ... add other events here
];

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Sync dark mode with local storage or global state
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const event = ALL_EVENTS.find(e => e.id === parseInt(id)) || ALL_EVENTS[0];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      {/* --- TOP HEADER (Matches Sidebar Style) --- */}
      <header className="px-10 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-white shadow-sm border border-slate-100 text-slate-600'}`}
        >
          <ArrowLeft size={18} /> Back to Events
        </button>

        <div className="flex items-center gap-4">
           <button className={`p-3.5 rounded-2xl shadow-sm ${darkMode ? 'bg-[#1E0B3B] text-slate-300' : 'bg-white border border-slate-100 text-slate-600'}`}>
              <Bell size={22} />
            </button>
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-slate-200">
               <div className="text-right hidden sm:block">
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Alex Johnson</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Premium</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black">AJ</div>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: CONTENT SECTION */}
          <div className="lg:col-span-2 space-y-10">
            <div className="relative rounded-[48px] overflow-hidden shadow-2xl group">
              <img src={event.image} className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
              <div className="absolute top-8 right-8 flex gap-3">
                <button className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all">
                  <Heart size={22} />
                </button>
                <button className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all">
                  <Share2 size={22} />
                </button>
              </div>
              <div className="absolute bottom-10 left-10 bg-[#0F0121]/60 backdrop-blur-md px-8 py-4 rounded-[24px] border border-white/10">
                <p className="text-white font-black text-sm tracking-wide">Starts in 109d 4h</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="px-5 py-2 bg-indigo-500/10 text-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                {event.category}
              </span>
              <h1 className="text-6xl font-black leading-tight tracking-tighter">
                {event.title}
              </h1>
              
              <div className={`p-10 rounded-[48px] ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-100'}`}>
                <h3 className="text-2xl font-black mb-6">About Event</h3>
                <p className={`text-lg leading-relaxed font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Experience the ultimate summer music festival featuring top artists from around the world. 
                  Three days of non-stop music, food, and celebration in the heart of San Francisco. 
                  Join thousands of music lovers for an unforgettable experience.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS SIDEBAR */}
          <div className="space-y-8">
            <div className={`p-10 rounded-[48px] shadow-2xl ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-50'}`}>
              <h3 className="text-2xl font-black mb-10">Event Details</h3>
              
              <div className="space-y-8">
                <DetailItem icon={<Calendar />} label="Date" value={event.date} darkMode={darkMode} />
                <DetailItem icon={<Clock />} label="Time" value="18:00" darkMode={darkMode} />
                <DetailItem icon={<MapPin />} label="Location" value={event.location} darkMode={darkMode} />
                <DetailItem icon={<Users />} label="Attendees" value="2547+ going" darkMode={darkMode} />
              </div>

              <button className="w-full mt-12 py-6 bg-indigo-600 text-white rounded-[28px] font-black text-xl shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all">
                Book Tickets - ${event.price}
              </button>
            </div>

            {/* ORGANIZER SECTION */}
            <div className={`p-10 rounded-[48px] ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-50'}`}>
              <h3 className="text-xl font-black mb-8">Organizer</h3>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-600/20">
                  M
                </div>
                <div>
                  <p className="font-black text-lg">Music Collective</p>
                  <p className="text-sm font-bold text-slate-500">Event Organizer</p>
                </div>
              </div>
              <button className={`w-full py-5 rounded-[24px] font-black text-sm tracking-widest uppercase transition-all border-2 ${darkMode ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-slate-100 hover:bg-slate-50'}`}>
                Follow
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function DetailItem({ icon, label, value, darkMode }) {
  return (
    <div className="flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-500 ${darkMode ? 'bg-[#0F0121]' : 'bg-indigo-50'}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">{label}</p>
        <p className="font-black text-base">{value}</p>
      </div>
    </div>
  );
}