import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft, Mail, Phone, MapPin, Moon, Sun,
  Bell, ShieldCheck, HelpCircle, LogOut, Edit3, Settings, AlertCircle
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const profileStats = [
    { label: "Hosted", value: "12" },
    { label: "Attended", value: "28" },
    { label: "Following", value: "145" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 font-sans p-12 relative ${darkMode ? 'bg-[#0F0121] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <header className="max-w-7xl mx-auto mb-12">
        <button onClick={() => navigate(-1)} className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-colors mb-6 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}>
          <ChevronLeft size={18} /> Back
        </button>
        <h1 className="text-4xl font-black tracking-tight">Profile</h1>
        <p className="text-slate-500 font-bold mt-1">Manage your account and preferences</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[45px] p-10 text-white shadow-2xl shadow-indigo-500/20 text-center relative overflow-hidden">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center bg-white/10 text-4xl font-black backdrop-blur-md">{user?.fullName?.slice(0, 2).toUpperCase() ?? "?"}</div>
              <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-lg hover:scale-110 transition-transform"><Edit3 size={18} /></button>
            </div>
            <h2 className="text-2xl font-black mb-1">{user?.fullName ?? "Guest"}</h2>
            <p className="text-indigo-200 font-bold text-sm mb-10">Event Enthusiast</p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {profileStats.map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl py-4 border border-white/10">
                  <p className="text-xl font-black">{stat.value}</p>
                  <p className="text-[10px] uppercase font-black text-indigo-200 tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all border border-white/10"><Settings size={18} /> Settings</button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <section className={`p-10 rounded-[40px] shadow-sm border ${darkMode ? 'bg-[#1E0B3B] border-white/5' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-black mb-8 flex items-center gap-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-5"><div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600"><Mail size={24} /></div><div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Email Address</p><p className="font-bold">{user?.email ?? "—"}</p></div></div>
              <div className="flex items-center gap-5"><div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600"><Phone size={24} /></div><div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p><p className="font-bold">{user?.phone || "—"}</p></div></div>
              <div className="flex items-center gap-5 md:col-span-2"><div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600"><MapPin size={24} /></div><div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Location</p><p className="font-bold">San Francisco, California, USA</p></div></div>
            </div>
          </section>

          <section className={`p-10 rounded-[40px] shadow-sm border ${darkMode ? 'bg-[#1E0B3B] border-white/5' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-black mb-8">Preferences</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5"><div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">{darkMode ? <Sun size={24} /> : <Moon size={24} />}</div><div><p className="font-black">Dark Mode</p><p className="text-sm text-slate-500 font-bold">Toggle theme appearance</p></div></div>
              <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 rounded-full transition-all relative ${darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} /></button>
            </div>
          </section>

          <section className={`p-10 rounded-[40px] shadow-sm border ${darkMode ? 'bg-[#1E0B3B] border-white/5' : 'bg-white border-slate-100'}`}>
            <h3 className="text-lg font-black mb-8">More Options</h3>
            <div className="space-y-4">
              {[{ icon: <Bell size={20} />, label: "Notifications" }, { icon: <ShieldCheck size={20} />, label: "Privacy & Security" }, { icon: <HelpCircle size={20} />, label: "Help & Support" }].map((opt, i) => (
                <div key={i} className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}><div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">{opt.icon}</div><span className="font-bold">{opt.label}</span></div>
              ))}
            </div>
          </section>

          <button onClick={() => setShowLogoutConfirm(true)} className="w-full py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-3xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-rose-500/20 transition-all active:scale-95"><LogOut size={20} /> Log Out</button>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className={`relative w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border text-center transition-all transform ${darkMode ? 'bg-[#1E0B3B] border-white/10' : 'bg-white border-slate-100'}`}>
            <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-6"><AlertCircle size={40} /></div>
            <h3 className="text-2xl font-black mb-2">Log Out?</h3>
            <p className="text-slate-500 font-bold mb-8">Are you sure you want to leave? You'll need to sign back in to access your data.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleLogout} className="w-full py-5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-500/25 transition-all active:scale-95 text-sm uppercase tracking-widest">Yes, Log Me Out</button>
              <button onClick={() => setShowLogoutConfirm(false)} className={`w-full py-5 rounded-2xl font-black transition-all active:scale-95 text-sm uppercase tracking-widest ${darkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-600'}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}