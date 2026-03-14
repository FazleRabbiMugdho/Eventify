import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, UploadCloud, CalendarDays, Clock3, LayoutDashboard, Calendar, PlusSquare, TrendingUp, MapPin, DollarSign, Type, AlignLeft, PartyPopper, Zap, X } from "lucide-react";

const CATEGORIES = ["Music", "Tech", "Business", "Sports", "Art", "Food", "Wellness", "Comedy", "Workshop"];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ title: "", category: "", date: "", time: "", location: "", price: "", description: "" });
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) return alert("File is too large. Max 10MB.");
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setCoverImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const required = ['title', 'category', 'date', 'location', 'description'];
    if (required.filter(f => !formData[f]).length > 0 || !coverImage) return alert("Please fill in all required fields (*) and upload a cover image.");
    alert("Event Published Successfully!");
    navigate('/');
  };

  const InputWrapper = ({ children, label, icon, required }) => (
    <div className="space-y-3">
      <label className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        {icon && React.cloneElement(icon, { size: 14, className: "text-indigo-500" })}
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClasses = `w-full px-8 py-5 rounded-2xl outline-none font-bold text-[15px] transition-all duration-300 border focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 ${darkMode ? 'bg-[#1E0B3B] border-white/5 text-white placeholder:text-slate-600' : 'bg-white border-slate-100 text-slate-900 placeholder:text-slate-400'}`;

  return (
    <div className={`flex min-h-screen w-full transition-colors duration-500 font-sans ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .ripple-btn { position: relative; overflow: hidden; transform: translate3d(0, 0, 0); } .ripple-btn:after { content: ""; display: block; position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; background-image: radial-gradient(circle, #fff 10%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%; transform: scale(10, 10); opacity: 0; transition: transform .5s, opacity 1s; } .ripple-btn:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }`}</style>

      <aside className={`w-72 border-r transition-all duration-500 flex flex-col sticky top-0 h-screen z-50 shrink-0 ${darkMode ? 'bg-[#0F0121] border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <TrendingUp size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-indigo-600'}`}>
              Eventify
            </span>
            <span className={`text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-indigo-400'}`}>
              Ticketing & Management
            </span>
          </div>
        </div>
        <nav className="flex-1 px-6 space-y-3 mt-8">
          <button onClick={() => navigate('/')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><LayoutDashboard size={20} /> Explore</button>
          <button onClick={() => navigate('/my-events')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn ${darkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"}`}><Calendar size={20} /> My Events</button>
          <button onClick={() => navigate('/create-event')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] font-bold text-[15px] transition-all duration-300 ripple-btn bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30`}><PlusSquare size={20} /> Create Event</button>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 px-12 py-10 relative overflow-y-auto">
        <header className="flex items-center justify-between mb-12 gap-10">
          <button onClick={() => navigate('/')} className={`flex items-center gap-3 px-8 py-4 rounded-[22px] font-black text-sm shadow-sm transition-all ripple-btn ${darkMode ? 'bg-white/5 text-white border border-white/10' : 'bg-white text-slate-600 border border-slate-100'}`}>
            <ChevronLeft size={18} strokeWidth={2.5} /> Back
          </button>

          {user ? (
            <div
              className={`flex items-center gap-5 ml-4 pr-6 border-l-2 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}
              onClick={() => navigate('/profile')}
            >
              <div className="text-right hidden sm:block">
                <p className={`text-base font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {user.fullName}
                </p>
                <p className="text-[11px] font-black text-indigo-500 uppercase tracking-widest">
                  Premium Member
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-xl shadow-indigo-600/30">
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
        </header>

        <div className="max-w-[1100px] mx-auto pb-32">
          <div className="mb-16"><h1 className="text-6xl font-black tracking-tighter leading-[0.9]">Create New Event</h1><p className="text-xl font-bold text-slate-500 mt-4 leading-relaxed">Fill in the details below to host your experience</p></div>
          <form onSubmit={handlePublish} className="space-y-16">
            <div className={`p-10 rounded-[48px] shadow-3xl ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-50'}`}>
              <InputWrapper label="Cover Image" icon={<PartyPopper />} required>
                <div onClick={() => fileInputRef.current.click()} className={`relative group h-[400px] rounded-[36px] border-4 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center p-10 overflow-hidden ${imagePreview ? 'border-indigo-500 shadow-xl shadow-indigo-500/10' : darkMode ? 'border-white/10 hover:border-indigo-500 bg-[#0F0121]' : 'border-slate-100 hover:border-indigo-400 bg-slate-50'}`}>
                  {imagePreview ? (
                    <><img src={imagePreview} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Preview" /><div className="absolute inset-0 bg-gradient-to-t from-[#0F0121]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" /><button onClick={removeImage} className="absolute top-6 right-6 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl ripple-btn opacity-0 group-hover:opacity-100 transition-opacity z-10"><X size={20} strokeWidth={3} /></button></>
                  ) : (
                    <><div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 shadow-2xl transition-colors ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white'}`}><UploadCloud size={44} className="text-indigo-500" strokeWidth={1.5} /></div><h4 className="text-2xl font-black tracking-tight mb-2">Upload event cover image</h4><p className="text-sm font-bold text-slate-500">PNG, JPG up to 10MB</p></>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/png, image/jpeg" className="hidden" />
                </div>
              </InputWrapper>
            </div>
            <div className={`p-12 rounded-[56px] shadow-3xl ${darkMode ? 'bg-[#1E0B3B]' : 'bg-white border border-slate-50'}`}>
              <h3 className="text-3xl font-black mb-12 tracking-tight flex items-center gap-4"><AlignLeft className="text-indigo-500" /> Core Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="sm:col-span-2"><InputWrapper label="Event Title" icon={<Type />} required><input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Enter a catchy event name" className={inputClasses} required /></InputWrapper></div>
                <InputWrapper label="Category" icon={<PartyPopper />} required><select name="category" value={formData.category} onChange={handleInputChange} className={`${inputClasses} appearance-none`} required><option value="" disabled>Select event category</option>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></InputWrapper>
                <InputWrapper label="Location" icon={<MapPin />} required><input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Event address" className={inputClasses} required /></InputWrapper>
                <InputWrapper label="Date" icon={<CalendarDays />} required><input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputClasses} required /></InputWrapper>
                <InputWrapper label="Time" icon={<Clock3 />}><input type="time" name="time" value={formData.time} onChange={handleInputChange} className={inputClasses} /></InputWrapper>
                <InputWrapper label="Ticket Price (USD)" icon={<DollarSign />}><input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" min="0" step="0.01" className={inputClasses} /></InputWrapper>
                <div className="sm:col-span-2"><InputWrapper label="Event Description" required><textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your experience..." rows={6} className={`${inputClasses} py-6 resize-none no-scrollbar`} required></textarea></InputWrapper></div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 mt-16 pt-10 border-t border-slate-100 dark:border-white/5">
                <button type="button" onClick={() => navigate('/')} className={`flex-1 w-full sm:w-auto text-center py-6 rounded-[28px] font-black text-lg transition-all ripple-btn ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>Cancel</button>
                <button type="submit" className="flex-1 w-full sm:w-auto text-center py-6 rounded-[28px] bg-indigo-600 text-white font-black text-lg shadow-2xl shadow-indigo-600/20 ripple-btn hover:bg-indigo-700">Publish Event</button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}