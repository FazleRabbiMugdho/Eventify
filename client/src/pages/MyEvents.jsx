import React, { useState, useContext, useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";

import { ThemeContext } from "../App";

import { useAuth } from "../context/AuthContext";

import ApiClient from "../api";

const api = new ApiClient();



import {

  Calendar, MapPin, Users, DollarSign, Eye,

  TrendingUp, LayoutDashboard, PlusSquare, User,

  Bell, X,

} from "lucide-react";



import img1 from "../assets/1.jpg";

import img2 from "../assets/2.jpg";

import img3 from "../assets/3.jpg";



import {

  AnimationStyles, FadeIn, InViewFade,

  CountUp, SkeletonStatCard, SkeletonHostedCard, usePageLoad,

} from "../components/ui";



// ─── Static Data (Fallback) ──────────────────────────────────────────────────

const STATS = [

  { id: 1, label: "Total Events", value: "12", icon: <TrendingUp size={24} /> },

  { id: 2, label: "Total Attendees", value: "2,847", icon: <Users size={24} /> },

  { id: 3, label: "Total Revenue", value: "$18,420", icon: <DollarSign size={24} /> },

  { id: 4, label: "Total Views", value: "15,634", icon: <Eye size={24} /> },

];



const HOSTED_EVENTS = [

  {

    id: 1,

    title: "Summer Music Festival 2026",

    image: img1,

    date: "Jun 15",

    location: "Golden Gate Park, San Francisco",

    attendees: "2547+",

    revenue: "$226,683",

    growth: "+15%",

    category: "Music",

    price: "$89",

    organizer: "Music Collective",

  },

  {

    id: 2,

    title: "Tech Summit 2026",

    image: img2,

    date: "Jul 22",

    location: "Moscone Center, San Francisco",

    attendees: "1847+",

    revenue: "$552,253",

    growth: "+15%",

    category: "Tech",

    price: "$299",

    organizer: "Tech Innovators",

  },

  {

    id: 3,

    title: "Business Networking Mixer",

    image: img3,

    date: "May 10",

    location: "The Ritz-Carlton, San Francisco",

    attendees: "324+",

    revenue: "$14,580",

    growth: "+15%",

    category: "Business",

    price: "$45",

    organizer: "BizConnect",

  },

];



// ─── Helper Components ───────────────────────────────────────────────────────



function LogoIcon() {

  return (

    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">

      <rect x="3" y="6" width="22" height="19" rx="3.5" fill="white" fillOpacity="0.15" />

      <rect x="3" y="6" width="22" height="19" rx="3.5" stroke="white" strokeWidth="1.8" />

      <rect x="3" y="6" width="22" height="7" rx="3.5" fill="white" fillOpacity="0.25" />

      <rect x="3" y="9.5" width="22" height="3.5" fill="white" fillOpacity="0.25" />

      <line x1="9" y1="3" x2="9" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />

      <line x1="19" y1="3" x2="19" y2="9" stroke="white" strokeWidth="2" strokeLinecap="round" />

      <path d="M14 14.5L15.2 17.2L18.2 17.5L16.1 19.4L16.7 22.3L14 20.8L11.3 22.3L11.9 19.4L9.8 17.5L12.8 17.2L14 14.5Z" fill="white" stroke="white" strokeWidth="0.5" />

    </svg>

  );

}



function DesktopSidebar({ darkMode, navigate }) {

  return (

    <aside className={`hidden lg:flex w-72 border-r transition-all duration-500 flex-col sticky top-0 h-screen z-50 shrink-0 ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}`}>

      <div className="p-8 flex items-center gap-4">

        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 shrink-0"><LogoIcon /></div>

        <div className="flex flex-col">

          <span className={`text-2xl font-black tracking-tighter ${darkMode ? "text-white" : "text-indigo-600"}`}>Eventify</span>

          <span className={`text-xs font-bold ${darkMode ? "text-slate-400" : "text-indigo-400"}`}>Ticketing & Management</span>

        </div>

      </div>

      <nav className="flex-1 px-6 space-y-3 mt-8">

        <button onClick={() => navigate("/")} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><LayoutDashboard size={20} /> Explore</button>

        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30"><Calendar size={20} /> My Events</button>

        <button onClick={() => navigate("/create-event")} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><PlusSquare size={20} /> Create Event</button>

      </nav>

    </aside>

  );

}



function TabletSidebar({ darkMode, navigate }) {

  return (

    <aside className={`hidden md:flex lg:hidden w-20 border-r transition-all duration-500 flex-col sticky top-0 h-screen z-50 shrink-0 items-center ${darkMode ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}`}>

      <div className="pt-6 pb-4">

        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"><LogoIcon /></div>

      </div>

      <nav className="flex flex-col gap-3 px-3 flex-1">

        <button onClick={() => navigate("/")} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ripple-btn ${darkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50"}`}><LayoutDashboard size={20} /></button>

        <button className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all ripple-btn bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"><Calendar size={20} /></button>

        <button onClick={() => navigate("/create-event")} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ripple-btn ${darkMode ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50"}`}><PlusSquare size={20} /></button>

      </nav>

    </aside>

  );

}



function MobileBottomNav({ darkMode, navigate }) {

  return (

    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 pt-3 pb-4 border-t backdrop-blur-xl ${darkMode ? "bg-[#0F0121]/95 border-white/5" : "bg-white/95 border-slate-100"}`}>

      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-1">

        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}><LayoutDashboard size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} /></div>

        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Explore</span>

      </button>

      <button className="flex flex-col items-center gap-1 px-3 py-1">

        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-600 shadow-lg shadow-indigo-600/30"><Calendar size={18} className="text-white" /></div>

        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500">Events</span>

      </button>

      <button onClick={() => navigate("/create-event")} className="flex flex-col items-center gap-1 px-3 py-1 -mt-6">

        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-600/40 border-4 border-white dark:border-[#0F0121]"><PlusSquare size={22} className="text-white" /></div>

        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mt-1">Create</span>

      </button>

      <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 px-3 py-1">

        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${darkMode ? "bg-white/5" : "bg-slate-100"}`}><User size={18} className={darkMode ? "text-slate-400" : "text-slate-500"} /></div>

        <span className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Profile</span>

      </button>

    </nav>

  );

}



// ─── Main Component ──────────────────────────────────────────────────────────



export default function MyEvents() {

  const navigate = useNavigate();

  const { darkMode } = useContext(ThemeContext);

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("hosting");

  const loaded = usePageLoad(500);



  // Database States

  const [myEvents, setMyEvents] = useState([]);

  const [isLoading, setIsLoading] = useState(true);



  // ── Smart initials with useMemo (from previous code) ──────────────────────

  const userInitials = useMemo(() => {

    if (!user) return null;

    const name = user.user_name || user.fullName || "";

    const parts = name.trim().split(" ");

    const initials =

      parts.length >= 2

        ? parts[0][0] + parts[parts.length - 1][0]

        : name.slice(0, 2);

    return initials.toUpperCase() || "?";

  }, [user]);



  // Fetch Data from DB

  useEffect(() => {

    const fetchMyEvents = async () => {

      try {

        const response = await api.client.get("/api/events");

        setMyEvents(response.data);

      } catch (err) {

        console.error("Failed to fetch events:", err);

      } finally {

        setIsLoading(false);

      }

    };

    fetchMyEvents();

  }, []);



  const handleDelete = async (eventId) => {

    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {

      await api.client.delete(`/api/events/${eventId}`);

      setMyEvents((prev) => prev.filter((ev) => (ev.id || ev.event_id) !== eventId));

    } catch (err) {

      alert("Failed to delete event.");

    }

  };



  const displayEvents = activeTab === "hosting" ? myEvents : HOSTED_EVENTS;



  return (

    <div className={`flex min-h-screen w-full transition-colors duration-500 font-sans ${darkMode ? "bg-[#0F0121] text-white" : "bg-[#F8FAFC] text-slate-900"}`}>

      <style>{`

        .no-scrollbar::-webkit-scrollbar { display: none; }

        .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); }

        .ripple-btn:after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10, 10); opacity: 0; transition: transform .5s, opacity 1s; }

        .ripple-btn:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }

      `}</style>

      <AnimationStyles />



      <DesktopSidebar darkMode={darkMode} navigate={navigate} />

      <TabletSidebar darkMode={darkMode} navigate={navigate} />



      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-5 sm:py-8 lg:py-10 overflow-y-auto pb-28 md:pb-10">



        <FadeIn delay={0}>

          <header className="flex items-center justify-between mb-8 sm:mb-12">

            <div>

              <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>My Events</h2>

              <p className={`font-bold mt-1 sm:mt-2 text-sm sm:text-lg ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage and track performance</p>

            </div>

            {/* ── Conditional avatar / login button (from previous code) ── */}

            {user ? (

              <div onClick={() => navigate("/profile")} className="cursor-pointer group ml-2">

                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm sm:text-lg font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">

                  {userInitials}

                </div>

              </div>

            ) : (

              <button

                onClick={() => navigate("/login")}

                className="ml-2 px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95"

              >

                Log In

              </button>

            )}

          </header>

        </FadeIn>



        {/* Stats Grid */}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">

          {STATS.map((stat, i) => (

            !loaded ? <SkeletonStatCard key={stat.id} darkMode={darkMode} gradient={stat.id === 1} /> :

              <FadeIn key={stat.id} delay={i * 80}>

                <div className={`p-5 sm:p-8 rounded-[28px] border transition-all hover:-translate-y-2 ${stat.id === 1 ? "bg-gradient-to-br from-indigo-600 to-blue-500 border-transparent" : darkMode ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-100"}`}>

                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 ${stat.id === 1 ? "bg-white/20 text-white" : darkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>

                    {React.cloneElement(stat.icon, { size: 20 })}

                  </div>

                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${stat.id === 1 ? "text-indigo-100" : "text-slate-400"}`}>{stat.label}</p>

                  <h3 className="text-2xl sm:text-4xl font-black"><CountUp value={stat.value} delay={i * 120} duration={1200} /></h3>

                </div>

              </FadeIn>

          ))}

        </div>



        {/* Tabs */}

        <FadeIn delay={200}>

          <div className={`inline-flex p-1.5 rounded-[24px] mb-8 w-full sm:w-auto ${darkMode ? "bg-[#1E0B3B]" : "bg-white shadow-sm border border-slate-100"}`}>

            {["hosting", "attending"].map(tab => (

              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 sm:flex-none px-10 py-4 rounded-[20px] font-black text-xs capitalize transition-all ${activeTab === tab ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" : "text-slate-500"}`}>{tab}</button>

            ))}

          </div>

        </FadeIn>



        {/* Cards */}

        {(!loaded || isLoading) ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">

            {[1, 2, 3].map((i) => <SkeletonHostedCard key={i} darkMode={darkMode} />)}

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">

            {displayEvents.map((event, i) => (

              <InViewFade key={event.id || event.event_id} delay={i * 100}>

                <div className={`group rounded-[36px] overflow-hidden transition-all duration-500 border ${darkMode ? "bg-[#1E0B3B] border-white/5" : "bg-white border-slate-100 shadow-sm"} hover:-translate-y-2`}>

                  <div className="relative h-44 sm:h-64">

                    <img

                      src={
                        event.image_url
                          ? `http://localhost:8000/storage/${event.image_url}`
                          : event.cover_picture
                            ? event.cover_picture.startsWith('http')
                              ? event.cover_picture
                              : `http://localhost:8000/storage/${event.cover_picture.replace('public/', '')}`
                            : event.image || img1
                      }

                      className="w-full h-full object-cover"

                      alt={event.event_name}

                    />

                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px] font-black uppercase">{event.category?.category_name || event.category || "General"}</div>

                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-black shadow-lg">${event.ticket_price || event.price || "0"}</div>

                  </div>



                  <div className="p-5 sm:p-10">

                    <h4 className="text-base sm:text-xl font-black mb-3">{event.event_name || event.title}</h4>

                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-6"><MapPin size={12} /> <span className="truncate">{event.location}</span></div>



                    <div className={`pt-8 border-t flex items-center justify-between ${darkMode ? "border-white/5" : "border-slate-50"}`}>

                      <div>

                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest"><TrendingUp size={11} className="inline mr-1" />{event.growth || "+0%"}</div>

                        <div className="text-lg sm:text-2xl font-black text-emerald-500">${(event.ticket_price * (event.attendees_count || 0)).toLocaleString()}</div>

                      </div>



                      <div className="flex items-center gap-2">

                        {activeTab === "hosting" && (

                          <button onClick={() => handleDelete(event.id || event.event_id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><X size={16} strokeWidth={3} /></button>

                        )}

                        <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black text-xs">{(event.event_name || event.title || "E").charAt(0)}</div>

                      </div>

                    </div>

                  </div>

                </div>

              </InViewFade>

            ))}

          </div>

        )}

      </main>



      {/* ── FAB — desktop/tablet only (from previous code) ── */}

      <div className="hidden md:block fixed bottom-12 right-12 z-[100]">

        <button

          onClick={() => navigate("/create-event")}

          className="w-16 h-16 lg:w-20 lg:h-20 bg-indigo-600 rounded-[24px] lg:rounded-[30px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:scale-110 active:scale-90 transition-all ripple-btn"

        >

          <TrendingUp size={26} strokeWidth={2.5} className="rotate-45" />

        </button>

      </div>



      <MobileBottomNav darkMode={darkMode} navigate={navigate} />

    </div>

  );

}