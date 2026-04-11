import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiClient from "../api";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const api = new ApiClient();

  const FEATURES = [
    {
      icon: "🎵",
      title: "Discover Events",
      desc: "Explore thousands of music, tech, sports and cultural events near you.",
    },
    {
      icon: "🎟️",
      title: "Instant Booking",
      desc: "Reserve tickets in seconds with secure, hassle-free checkout.",
    },
    {
      icon: "📊",
      title: "Host & Manage",
      desc: "Create your own events and track attendance, revenue and growth.",
    },
  ];

  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.login(form.email, form.password);

      if (response && response.token) {
        localStorage.setItem("token", response.token);

        const profile = await api.getProfile();
        if (profile) {
          login({
            user_name: profile.user_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            profile_picture: profile.profile_picture || "",
          });
        } else {
          login({
            user_name: response.user_name || "",
            email: response.email || "",
            phone: response.phone || "",
            profile_picture: response.profile_picture || "",
          });
        }

        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:8000";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 transition-colors duration-500"
      style={{ background: darkMode ? "#0F0121" : "#F8FAFC" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .auth-wrap * { font-family: 'Outfit', sans-serif; }
        .auth-input { background: transparent; color: ${darkMode ? "white" : "#0f172a"}; width: 100%; font-size: 0.875rem; }
        .auth-input:focus { outline: none; }
        .auth-input::placeholder { color: #64748b; }
      `}</style>

      <div className="auth-wrap w-full max-w-4xl">

        {/* ── MAIN CARD ── */}
        <div
          className="flex rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          style={{ minHeight: "500px" }}
        >

          {/* ── LEFT PANEL ── */}
          <div
            className="relative hidden md:flex flex-col justify-center px-12 py-10 overflow-hidden"
            style={{ width: "42%", background: "#4338ca" }}
          >
            {/* Blob top-left */}
            <div className="absolute" style={{ width: 340, height: 340, borderRadius: "50%", background: "linear-gradient(135deg, #818cf8, #6366f1)", top: -90, left: -70, opacity: 0.6 }} />
            {/* Blob bottom-left */}
            <div className="absolute" style={{ width: 210, height: 210, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", bottom: 10, left: -30, opacity: 0.5 }} />
            {/* Blob bottom-center */}
            <div className="absolute" style={{ width: 155, height: 155, borderRadius: "50%", background: "linear-gradient(135deg, #a5b4fc, #818cf8)", bottom: 50, left: 165, opacity: 0.45 }} />

            {/* Welcome text */}
            <div className="relative z-10">
              <h2 className="text-white font-extrabold leading-tight" style={{ fontSize: "2.4rem", fontFamily: "'Outfit', sans-serif" }}>
                Welcome to<br />Eventify
              </h2>
            </div>

            {/* Feature carousel */}
            <div className="relative z-10 mt-10">
              <div
                className="rounded-2xl px-6 py-5 transition-all duration-500"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{FEATURES[activeFeature].icon}</span>
                  <div>
                    <p className="text-white font-black text-base">{FEATURES[activeFeature].title}</p>
                    <p className="text-indigo-200 text-sm font-medium mt-1 leading-relaxed">
                      {FEATURES[activeFeature].desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center gap-2 mt-4 justify-center">
                {FEATURES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFeature(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === activeFeature ? "20px" : "6px",
                      height: "6px",
                      background: i === activeFeature ? "white" : "rgba(255,255,255,0.35)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            className="flex flex-col justify-center px-10 py-10 flex-1"
            style={{ background: darkMode ? "#1E0B3B" : "#ffffff" }}
          >
            <h1 className={`${darkMode ? "text-white" : "text-slate-900"} font-bold mb-8`} style={{ fontSize: "1.75rem", fontFamily: "'Outfit', sans-serif" }}>
              Log In
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Email */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{
                  background: darkMode ? "#0F0121" : "#f1f5f9",
                  border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`
                }}
              >
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="auth-input"
                />
              </div>

              {/* Password */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                style={{
                  background: darkMode ? "#0F0121" : "#f1f5f9",
                  border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`
                }}
              >
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-indigo-400 transition-colors shrink-0">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className="w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all shrink-0"
                    style={{
                      background: rememberMe ? "#6366f1" : "transparent",
                      border: `2px solid ${rememberMe ? "#6366f1" : "#4b5563"}`,
                    }}
                  >
                    {rememberMe && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Remember me</span>
                </label>
                <a href="#" className={`text-sm hover:text-indigo-500 transition-colors font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  Forgot Password?
                </a>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="text-sm px-4 py-2.5 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95 mt-1"
                style={{ background: "linear-gradient(90deg, #4f46e5, #6366f1)" }}
              >
                Log In
              </button>

              {/* Or divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px" style={{ background: darkMode ? "#2d3650" : "#e2e8f0" }} />
                <span className="text-xs font-semibold" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>or</span>
                <div className="flex-1 h-px" style={{ background: darkMode ? "#2d3650" : "#e2e8f0" }} />
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:brightness-95 active:scale-95"
                style={{
                  background: darkMode ? "#0F0121" : "#ffffff",
                  border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`,
                  color: darkMode ? "#e2e8f0" : "#374151",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.4 13.7 17.7 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z" />
                  <path fill="#FBBC05" d="M10.7 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7-5.4A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.4-5.7-.3-.5z" />
                  <path fill="#34A853" d="M24 47c5.9 0 10.9-2 14.5-5.3l-7.4-5.7c-2 1.3-4.4 2-7.1 2-6.3 0-11.6-4.2-13.5-10l-7.4 5.7C7 40.3 14.8 47 24 47z" />
                </svg>
                Continue with Google
              </button>

            </form>

            {/* Register link */}
            <p className="text-slate-500 text-sm text-center mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* ── BACK LINK ── */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 border hover:scale-105 active:scale-95"
            style={{
              background: darkMode ? "#1E0B3B" : "#ffffff",
              border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`,
              color: darkMode ? "#94a3b8" : "#64748b",
            }}
          >
            <ArrowRight size={14} className="text-indigo-400 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
            <span className={darkMode ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-indigo-600"} style={{ transition: "color 0.2s" }}>
              Back to Eventify
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}