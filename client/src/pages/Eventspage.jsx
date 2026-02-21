import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import img6 from '../assets/6.jpg';
import img7 from '../assets/7.jpg';
import img8 from '../assets/8.jpg';
import img9 from '../assets/9.jpg';

const EVENTS = [
  {
    id: 1,
    title: "Summer Music Festival 2026",
    category: "Concerts",
    status: "Selling Fast",
    statusColor: "orange",
    date: "Wed, Jul 15, 2026",
    location: "Central Park Arena",
    tickets: 245,
    price: 89,
    image: img1,
  },
  {
    id: 2,
    title: "Tech Summit 2026",
    category: "Tech",
    status: "Selling Fast",
    statusColor: "orange",
    date: "Sun, Mar 22, 2026",
    location: "Innovation Center",
    tickets: 150,
    price: 299,
    image: img2,
  },
  {
    id: 3,
    title: "NBA Finals Game 3",
    category: "Sports",
    status: "Low Stock",
    statusColor: "red",
    date: "Wed, Jun 10, 2026",
    location: "Madison Square Garden",
    tickets: 89,
    price: 350,
    image: img3,
  },
  {
    id: 4,
    title: "Rock Legends Live",
    category: "Concerts",
    status: "Available",
    statusColor: "green",
    date: "Wed, Aug 5, 2026",
    location: "Stadium Arena",
    tickets: 412,
    price: 125,
    image: img4,
  },
  {
    id: 5,
    title: "AI & Machine Learning Expo",
    category: "Tech",
    status: "Available",
    statusColor: "green",
    date: "Sat, Apr 18, 2026",
    location: "Convention Hall",
    tickets: 320,
    price: 199,
    image: img5,
  },
  {
    id: 6,
    title: "World Cup Qualifier",
    category: "Sports",
    status: "Available",
    statusColor: "green",
    date: "Sat, Sept 12, 2026",
    location: "National Stadium",
    tickets: 1250,
    price: 75,
    image: img6,
  },
  {
    id: 7,
    title: "Jazz Night Under Stars",
    category: "Concerts",
    status: "Selling Fast",
    statusColor: "orange",
    date: "Wed, May 20, 2026",
    location: "Rooftiop Lounge",
    tickets: 180,
    price: 65,
    image: img7,
  },
  {
    id: 8,
    title: "Startup Pitch Competition",
    category: "Tech",
    status: "Selling Fast",
    statusColor: "orange",
    date: "Sat, Feb 28, 2026",
    location: "Tech Hub",
    tickets: 200,
    price: 50,
    image: img8,
  },
  {
    id: 9,
    title: "Tennis Grand Slam Finals",
    category: "Sports",
    status: "Available",
    statusColor: "green",
    date: "Tue, Jul 28, 2026",
    location: "Tennis Complex",
    tickets: 567,
    price: 220,
    image: img9,
  },
];

// ── HELPERS 
const STATUS_DOT = {
  orange: "bg-orange-400",
  red: "bg-red-500",
  green: "bg-green-500",
};

const CATEGORIES = ["All Categories", "Concerts", "Tech", "Sports"];

// ── SUB-COMPONENTS 

function Navbar({ search, setSearch, category, setCategory }) {  const navigate = useNavigate();  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Brand */}
        <a href="#" className="flex items-center gap-3 shrink-0 no-underline">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center text-white text-lg shadow-md">
            📅
          </div>
          <div className="leading-tight">
            <p className="text-gray-900 font-bold text-base">Eventify</p>
            <p className="text-gray-400 text-xs font-normal">Ticketing & Management</p>
          </div>
        </a>

        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:border-violet-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button onClick={() => navigate('/login')} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            👤 Login
          </button>
        </div>
      </div>
    </nav>
  );
}

function Sidebar({ dateFrom, setDateFrom, dateTo, setDateTo, price, setPrice, onReset }) {
  return (
    <aside className="w-64 shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 text-base mb-6">
          <span className="text-violet-600">⚙</span> Filters
        </h3>

        {/* Date Range */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Date Range</p>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 mb-2 outline-none focus:border-violet-500 transition-colors"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Price Range</p>
          <input
            type="range"
            min={0}
            max={500}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full accent-violet-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>${price}</span>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="w-full border border-gray-200 hover:border-violet-500 hover:text-violet-600 text-gray-700 font-medium text-sm py-2.5 rounded-xl transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}

function StatusBadge({ status, color }) {
  return (
    <span className="flex items-center gap-1.5 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[color]}`} />
      {status}
    </span>
  );
}

function EventCard({ event }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Badges */}
        <span className="absolute top-3 left-3 bg-white text-violet-600 text-xs font-semibold px-3 py-1 rounded-full">
          {event.category}
        </span>
        <span className="absolute top-3 right-3">
          <StatusBadge status={event.status} color={event.statusColor} />
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-bold text-gray-900 text-base mb-4 leading-snug">{event.title}</h2>

        <div className="flex flex-col gap-2 mb-5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-violet-500 w-4 text-center">📅</span>
            {event.date}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-violet-500 w-4 text-center">📍</span>
            {event.location}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-violet-500 w-4 text-center">🎟</span>
            {event.tickets.toLocaleString()} tickets available
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="text-2xl font-bold text-gray-900">${event.price}</p>
          </div>
          <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE
export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [price, setPrice] = useState(500);

  const handleReset = () => {
    setDateFrom("");
    setDateTo("");
    setPrice(500);
    setSearch("");
    setCategory("All Categories");
  };

  // Filter logic
  const filtered = EVENTS.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "All Categories" || e.category === category;
    const matchPrice = e.price <= price;

    const eventDate = new Date(e.date);          
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const matchDateFrom = !fromDate || eventDate >= fromDate;
    const matchDateTo = !toDate || eventDate <= toDate;

    return (
      matchSearch &&
      matchCategory &&
      matchPrice &&
      matchDateFrom &&
      matchDateTo
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className="max-w-screen-xl mx-auto px-6 py-7 flex gap-6">
        <Sidebar
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          price={price}
          setPrice={setPrice}
          onReset={handleReset}
        />

        <main className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} events found</p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <span className="text-5xl mb-4">🎟</span>
              <p className="text-lg font-semibold">No events found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}