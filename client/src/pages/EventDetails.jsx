import React, { useState, useContext, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import {
  Calendar, Clock, MapPin, Users, ArrowLeft,
  Info, LayoutDashboard, PlusSquare, CheckCircle,
  Ticket, Bell, User, Loader2
} from "lucide-react";
import { AnimationStyles, FadeIn, SlideIn, usePageLoad, SkeletonEventDetail } from "../components/ui";
import CheckoutPanel from "../components/CheckoutPanel";
import ApiClient from "../api";
import { secrets } from "../secrets";
import logoLight from '../assets/eventify-logo-light.png';
import logoDark from '../assets/eventify-logo-dark.png';

// Mock data is no longer needed but kept as an empty reference if necessary
const ALL_EVENTS = [];

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

function DetailItem({ icon, label, value, dm }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div
        className={`
          w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center
          text-indigo-500 shrink-0
          ${dm ? "bg-[#0F0121]" : "bg-indigo-50"}
        `}
      >
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">
          {label}
        </p>
        <p className={`font-bold text-sm leading-snug ${dm ? "text-white" : "text-slate-800"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function DesktopSidebar({ dm, navigate }) {
  return (
    <aside
      className={`
        hidden lg:flex w-72 border-r transition-all duration-500
        flex-col sticky top-0 h-screen z-50 shrink-0
        ${dm ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}
      `}
    >
      <div className="p-8">
        <img
          src={dm ? logoDark : logoLight}
          alt="Eventify"
          onClick={() => navigate('/')}
          className="w-48 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      </div>
      <nav className="flex-1 px-6 space-y-3 mt-8">
        {[
          { icon: <LayoutDashboard size={20} />, label: "Explore", path: "/" },
          { icon: <Calendar size={20} />, label: "My Events", path: "/my-events" },
          { icon: <PlusSquare size={20} />, label: "Create Event", path: "/create-event" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              w-full flex items-center gap-4 px-5 py-4
              rounded-[22px] font-bold text-[15px] transition-all ripple-btn
              ${dm ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function TabletSidebar({ dm, navigate }) {
  return (
    <aside
      className={`
        hidden md:flex lg:hidden w-20 border-r transition-all duration-500
        flex-col sticky top-0 h-screen z-50 shrink-0 items-center
        ${dm ? "bg-[#0F0121] border-white/5" : "bg-white border-slate-100"}
      `}
    >
      <div className="pt-6 pb-4 px-3">
        <img
          src={dm ? logoDark : logoLight}
          alt="Eventify"
          onClick={() => navigate('/')}
          className="w-12 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        />
      </div>
      <div className={`w-8 h-px mb-4 ${dm ? "bg-white/10" : "bg-slate-100"}`} />
      <nav className="flex flex-col gap-3 px-3 flex-1">
        {[
          { icon: <LayoutDashboard size={20} />, path: "/" },
          { icon: <Calendar size={20} />, path: "/my-events" },
          { icon: <PlusSquare size={20} />, path: "/create-event" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              w-14 h-14 rounded-2xl flex items-center justify-center
              transition-all ripple-btn
              ${dm ? "text-slate-400 hover:bg-white/5 hover:text-white" : "text-slate-500 hover:bg-slate-50"}
            `}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function MobileBottomNav({ dm, navigate }) {
  return (
    <nav
      className={`
        md:hidden fixed bottom-0 left-0 right-0 z-50
        flex items-center justify-around px-4 pt-3 pb-4
        border-t backdrop-blur-xl
        ${dm ? "bg-[#0F0121]/95 border-white/5" : "bg-white/95 border-slate-100"}
      `}
    >
      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${dm ? "bg-white/5" : "bg-slate-100"}`}>
          <LayoutDashboard size={18} className={dm ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${dm ? "text-slate-500" : "text-slate-400"}`}>Explore</span>
      </button>
      <button onClick={() => navigate("/my-events")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${dm ? "bg-white/5" : "bg-slate-100"}`}>
          <Calendar size={18} className={dm ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${dm ? "text-slate-500" : "text-slate-400"}`}>Events</span>
      </button>
      <button onClick={() => navigate("/create-event")} className="flex flex-col items-center gap-1 px-3 py-1 -mt-6">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-600/40 border-4 border-white dark:border-[#0F0121]">
          <PlusSquare size={22} className="text-white" />
        </div>
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider mt-1">Create</span>
      </button>
      <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${dm ? "bg-white/5" : "bg-slate-100"}`}>
          <Bell size={18} className={dm ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${dm ? "text-slate-500" : "text-slate-400"}`}>Alerts</span>
      </button>
      <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 px-3 py-1">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${dm ? "bg-white/5" : "bg-slate-100"}`}>
          <User size={18} className={dm ? "text-slate-400" : "text-slate-500"} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-wider ${dm ? "text-slate-500" : "text-slate-400"}`}>Profile</span>
      </button>
    </nav>
  );
}

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const api = new ApiClient();
        const data = await api.getEvent(parseInt(id));
        if (data) {
          const mapped = {
            id: data.event_id,
            title: data.event_name,
            description: data.description,
            startDateTime: data.start_date_time,
            date: data.start_date_time ? data.start_date_time.split(' ')[0] : "TBD",
            time: data.start_date_time && data.start_date_time.includes(' ') ? data.start_date_time.split(' ')[1] : '',
            location: data.venue?.location || "TBD",
            category: data.category?.category_name || "General",
            price: data.tickets && data.tickets.length > 0 ? data.tickets[0].price : 0,
            attendees: data.tickets?.reduce((acc, t) => acc + (t.bookings?.length || 0), 0) || 0,
            image: data.image_url
              ? (data.image_url.startsWith('http') ? data.image_url : `${secrets.backendEndpoint}/storage/${data.image_url}`)
              : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"
          };
          setEventData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const event = eventData;
  const dm = darkMode;
  const loaded = usePageLoad(400);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!event || !event.startDateTime) return;
    const updateCountdown = () => {
      const now = new Date();
      const eventTime = new Date(event.startDateTime);
      const diff = eventTime - now;
      if (diff <= 0) {
        setTimeLeft("Event Started");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      let text = "Starts in ";
      if (days > 0) text += `${days}d `;
      if (hours > 0) text += `${hours}h `;
      if (days === 0 && hours === 0) text += `${mins}m`;
      setTimeLeft(text.trim());
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [event]);

  const userInitials = useMemo(() => {
    if (!user) return null;
    const name = user.user_name || user.fullName || "";
    const parts = name.trim().split(" ");
    const initials = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2);
    return initials.toUpperCase() || "?";
  }, [user]);

  // --- Conditionals moved into the main return for consistent layout ---

  return (
    <div
      className={`
        flex min-h-screen w-full overflow-hidden
        transition-colors duration-500 font-sans
        ${dm ? "bg-[#0F0121] text-white" : "bg-[#F8FAFC] text-slate-900"}
      `}
    >
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
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .mobile-bottom-nav { padding-bottom: calc(0.5rem + env(safe-area-inset-bottom)); }
        }
      `}</style>
      <AnimationStyles />

      <DesktopSidebar dm={dm} navigate={navigate} />
      <TabletSidebar dm={dm} navigate={navigate} />

      <main className="flex-1 min-w-0 overflow-x-hidden no-scrollbar pb-24 md:pb-0">
        <header
          className={`
            px-4 sm:px-8 lg:px-10 py-4 sm:py-5 flex justify-between items-center
            sticky top-0 z-[60] backdrop-blur-md border-b
            ${dm ? "border-white/5" : "border-slate-100"}
          `}
        >
          <button
            onClick={() => navigate("/")}
            className={`
              flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl
              font-black text-xs sm:text-sm shadow-sm transition-all ripple-btn
              ${dm
                ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }
            `}
          >
            <ArrowLeft size={14} strokeWidth={2.5} /> Back
          </button>
          {user ? (
            <div onClick={() => navigate("/profile")} className="cursor-pointer group">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${user.profile_picture ? "" : "bg-indigo-600"} overflow-hidden flex items-center justify-center text-white text-xs sm:text-sm font-black shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform`}>
                {user.profile_picture ? (
                  <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
            >
              Log In
            </button>
          )}
        </header>

        <div className="px-4 sm:px-8 lg:px-10 py-5 sm:py-8 pb-8 sm:pb-20">
          {loading || !loaded ? (
            <SkeletonEventDetail darkMode={dm} />
          ) : !event ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-center font-black text-2xl mb-8">Event Not Found</p>
              <button
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95"
              >
                Go Back Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
              {/* Left Column */}
              <div className="lg:col-span-8 space-y-5 sm:space-y-8 min-w-0">
                <FadeIn delay={0}>
                  <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-[220px] sm:h-[320px] lg:h-[420px] object-cover"
                    />
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                      <div className="bg-[#0F0121]/80 backdrop-blur-xl px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-white font-black text-xs sm:text-sm border border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.6)]">
                        ⏱ {timeLeft || "Starts soon"}
                      </div>
                    </div>
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                      <span className="bg-indigo-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={100}>
                  <div className="space-y-4 sm:space-y-5">
                    <h1 className={`text-2xl sm:text-4xl font-black tracking-tight leading-tight ${dm ? "text-white" : "text-slate-900"}`}>
                      {event.title}
                    </h1>
                    <div className={`p-5 sm:p-7 rounded-[20px] sm:rounded-[24px] ${dm ? "bg-[#1E0B3B]" : "bg-white border border-slate-100 shadow-sm"}`}>
                      <h3 className={`text-base sm:text-lg font-black mb-3 sm:mb-4 flex items-center gap-3 ${dm ? "text-white" : "text-slate-900"}`}>
                        <Info size={18} className="text-indigo-500" /> About this Event
                      </h3>
                      <p className={`text-sm font-medium leading-relaxed ${dm ? "text-slate-400" : "text-slate-600"}`}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 min-w-0 w-full">
                <SlideIn from="right" delay={180}>
                  <div
                    className={`
                      p-5 sm:p-7 rounded-[22px] sm:rounded-[28px] lg:sticky lg:top-24
                      ${dm ? "bg-[#1E0B3B] border border-white/5" : "bg-white border border-slate-100 shadow-md"}
                    `}
                  >
                    <div className="mb-5 sm:mb-6">
                      <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Starting from</p>
                      <div className="flex items-end gap-2">
                        <span className={`text-3xl sm:text-4xl font-black ${dm ? "text-white" : "text-slate-900"}`}>
                          ৳{event.price.toLocaleString()}
                        </span>
                        <span className="text-slate-400 font-bold text-sm mb-1">/ person</span>
                      </div>
                    </div>

                    <div className={`h-px mb-5 sm:mb-6 ${dm ? "bg-white/5" : "bg-slate-100"}`} />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest mb-4 sm:mb-5 text-slate-400">Event Details</h3>
                    <div className="space-y-4 sm:space-y-5 mb-5 sm:mb-7">
                      <DetailItem icon={<Calendar />} label="Date" value={event.date} dm={dm} />
                      <DetailItem icon={<Clock />} label="Time" value={event.time} dm={dm} />
                      <DetailItem icon={<MapPin />} label="Location" value={event.location} dm={dm} />
                      <DetailItem icon={<Users />} label="Attendance" value={`${event.attendees} Attending`} dm={dm} />
                    </div>

                    <div className={`h-px mb-5 sm:mb-6 ${dm ? "bg-white/5" : "bg-slate-100"}`} />

                    <button
                      onClick={() => !isBooked && setShowCheckout(true)}
                      className={`
                        w-full py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base
                        transition-all ripple-btn active:scale-95 shadow-lg
                        flex items-center justify-center gap-2
                        ${isBooked
                          ? "bg-emerald-500 text-white shadow-emerald-500/20 cursor-default"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                        }
                      `}
                    >
                      {isBooked
                        ? <><CheckCircle size={18} /> Ticket Reserved</>
                        : <><Ticket size={18} /> Reserve Ticket</>
                      }
                    </button>
                    <p className="text-center text-[11px] sm:text-xs text-slate-400 font-medium mt-3">
                      Free cancellation up to 48hrs before
                    </p>
                  </div>
                </SlideIn>
              </div>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav dm={dm} navigate={navigate} />

      {showCheckout && (
        <CheckoutPanel
          event={event}
          dm={dm}
          onClose={() => setShowCheckout(false)}
          onConfirmed={() => setIsBooked(true)}
        />
      )}
    </div>
  );
}