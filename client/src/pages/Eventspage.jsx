import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import { 
  LayoutDashboard, Calendar, PlusSquare, Search, 
  Bell, Moon, Sun, MapPin, ArrowRight, TrendingUp, Filter, X,
  SearchX 
} from "lucide-react";

// Professional Asset Management
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

export default function Eventpage() {
  const navigate = useNavigate(); // Hook initialization
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(1000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const resetFilters = () => {
    setPriceRange(1000);
    setStartDate("");
    setEndDate("");
    setSelectedCategory("All");
    setSearchQuery("");
  };

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
    <div className={`flex min-h-screen transition-colors duration-500 ease-in-out font-sans ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        input[type='range'] { -webkit-appearance: none; background: transparent; }
        input[type='range']::-webkit-slider-runnable-track {
          width: 100%; height: 6px;
          background: linear-gradient(to right, #6366f1 ${ (priceRange / 1000) * 100 }%, ${darkMode ? '#1E0B3B' : '#f1f5f9'} ${ (priceRange / 1000) * 100 }%);
          border-radius: 10px;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%;
          background: #6366f1; cursor: pointer; margin-top: -7px;
          border: 3px solid ${darkMode ? '#0F0121' : 'white'};
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
        }
      `}</style>

      {/* --- SIDEBAR --- */}
      <aside className={`w-64 border-r transition-all duration-500 flex flex-col sticky top-0 h-screen z-50 ${darkMode ? 'bg-[#0F0121] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <TrendingUp size={22} strokeWidth={2.5} />
          </div>
          <span className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-indigo-600'}`}>Eventify</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {["Explore", "My Events", "Create Event"].map((name, i) => (
            <button key={name} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${i === 0 ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20" : darkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:bg-slate-50"}`}>
               {i === 0 ? <LayoutDashboard size={18} /> : i === 1 ? <Calendar size={18} /> : <PlusSquare size={18} />}
               {name}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-10 py-8 relative">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-10 gap-8">
          <div className="relative flex-1 max-w-2xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              placeholder="Search events, categories, locations..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-16 pr-8 py-4 rounded-[24px] shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none font-semibold text-sm transition-all ${darkMode ? 'bg-[#1E0B3B] border-none text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900'}`}
            />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-3.5 rounded-2xl shadow-sm transition-all duration-500 flex items-center justify-center ${darkMode ? 'bg-[#1E0B3B] text-yellow-400' : 'bg-white border border-slate-100 text-slate-600'}`}>
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <div className={`flex items-center gap-4 ml-2 pl-4 border-l ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Alex Johnson</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Premium</p>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-11 h-11 rounded-2xl bg-indigo-50 border-2 border-white/10 shadow-md" alt="" />
            </div>
          </div>
        </header>

        {/* HANDPICKED (FEATURED) */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Handpicked For You</h3>
            <div className={`h-px flex-1 ml-8 ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {FEATURED_EVENTS.map((event) => (
              <div 
                key={event.id} 
                onClick={() => navigate(`/event/${event.id}`)} // Trigger Navigation
                className="relative group h-[380px] rounded-[44px] overflow-hidden shadow-2xl cursor-pointer"
              >
                <img src={event.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0121] via-[#0F0121]/10 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h4 className="text-2xl font-black mb-4 leading-tight">{event.title}</h4>
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-indigo-400">Entry</p>
                      <span className="text-2xl font-black">${event.price}</span>
                    </div>
                    <button className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${darkMode ? 'bg-[#1E0B3B] text-white hover:bg-indigo-600' : 'bg-white text-slate-950 hover:bg-indigo-600 hover:text-white'}`}>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DISCOVER & FILTER */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className={`text-3xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Discover Events</h2>
            <p className={`font-bold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Find your next amazing experience</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-2xl transition-all shadow-md ${showFilters ? 'bg-indigo-600 text-white' : darkMode ? 'bg-[#1E0B3B] text-slate-400' : 'bg-white text-slate-400 border border-slate-100'}`}
            >
               {showFilters ? <X size={20} /> : <Filter size={20} />}
            </button>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar flex-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap shadow-sm ${
                    selectedCategory === cat 
                    ? "bg-indigo-600 text-white shadow-indigo-500/20" 
                    : darkMode ? "bg-[#1E0B3B] text-slate-400 hover:text-white" : "bg-white text-slate-400 border border-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-[400px] opacity-100 mb-10' : 'max-h-0 opacity-0'}`}>
            <div className={`p-8 rounded-[40px] shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-100'}`}>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date Range Filter</label>
                <div className="flex gap-4">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`flex-1 p-3 rounded-xl border-none text-sm font-bold outline-none ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-slate-50 text-slate-900'}`} />
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`flex-1 p-3 rounded-xl border-none text-sm font-bold outline-none ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-slate-50 text-slate-900'}`} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Price Limit</label>
                   <span className="text-indigo-400 font-black text-sm">Up to ${priceRange}</span>
                </div>
                <input type="range" min="0" max="1000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full cursor-pointer" />
                <button onClick={resetFilters} className="text-[10px] font-black text-indigo-500 uppercase hover:text-indigo-400">Reset Filters</button>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Upcoming Events</h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{filteredEvents.length} Events Matching</span>
          </div>
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => navigate(`/event/${event.id}`)} // Trigger Navigation on Card Click
                  className={`group rounded-[40px] p-4 transition-all duration-500 cursor-pointer hover:shadow-2xl ${darkMode ? 'bg-[#1E0B3B] hover:shadow-indigo-500/10' : 'bg-white border border-slate-50 hover:shadow-indigo-100/50'}`}
                >
                  <div className="relative h-64 rounded-[30px] overflow-hidden mb-6">
                    <img src={event.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md ${darkMode ? 'bg-[#0F0121]/80 text-white' : 'bg-white/95 text-slate-900'}`}>
                      <span className="font-black text-sm">${event.price}</span>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                      <span className="text-[10px] font-black uppercase text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-lg">{event.category}</span>
                      <h4 className={`text-lg font-black mt-4 mb-6 group-hover:text-indigo-400 transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{event.title}</h4>
                      <div className={`flex items-center justify-between pt-5 border-t ${darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                          <span className={`font-bold text-xs uppercase flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                             <Calendar size={14} /> {event.date}
                          </span>
                          <button 
                            className="text-indigo-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                          >
                            Buy Ticket <ArrowRight size={14} />
                          </button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center py-20 px-10 rounded-[44px] border-2 border-dashed ${darkMode ? 'border-white/5 bg-[#1E0B3B]/30' : 'border-slate-100 bg-white'}`}>
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-6">
                <SearchX size={40} />
              </div>
              <h4 className="text-xl font-black mb-2">No matching events found</h4>
              <p className={`text-sm font-bold mb-8 text-center max-w-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button 
                onClick={resetFilters}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-105 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}