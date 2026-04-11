import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ApiClient from "../api";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import { Mail, ArrowRight } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      if (res) {
        toast.success(res.message || "Reset code sent to your email!");
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
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
        <div
          className="flex rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          style={{ minHeight: "500px" }}
        >
          {/* ── LEFT PANEL (Mirroring Login) ── */}
          <div
            className="relative hidden md:flex flex-col justify-center px-12 py-10 overflow-hidden"
            style={{ width: "42%", background: "#4338ca" }}
          >
            <div className="absolute" style={{ width: 340, height: 340, borderRadius: "50%", background: "linear-gradient(135deg, #818cf8, #6366f1)", top: -90, left: -70, opacity: 0.6 }} />
            <div className="absolute" style={{ width: 210, height: 210, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", bottom: 10, left: -30, opacity: 0.5 }} />
            <div className="absolute" style={{ width: 155, height: 155, borderRadius: "50%", background: "linear-gradient(135deg, #a5b4fc, #818cf8)", bottom: 50, left: 165, opacity: 0.45 }} />

            <div className="relative z-10">
              <h2 className="text-white font-extrabold leading-tight" style={{ fontSize: "2.4rem", fontFamily: "'Outfit', sans-serif" }}>
                Recover<br />Account
              </h2>
              <p className="text-indigo-200 font-medium mt-3 text-sm leading-relaxed">
                Don't worry, it happens to the best of us. Let's get you back in.
              </p>
            </div>

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

          {/* ── RIGHT PANEL (New Content) ── */}
          <div
            className="flex flex-col justify-center px-10 py-10 flex-1"
            style={{ background: darkMode ? "#1E0B3B" : "#ffffff" }}
          >
            <h1 className={`${darkMode ? "text-white" : "text-slate-900"} font-bold mb-4`} style={{ fontSize: "1.75rem", fontFamily: "'Outfit', sans-serif" }}>
              Forgot Password?
            </h1>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Enter your email address and we'll send you a 6-digit code to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                style={{
                  background: darkMode ? "#0F0121" : "#f1f5f9",
                  border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`
                }}
              >
                <Mail size={16} className="text-slate-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="auth-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: "linear-gradient(90deg, #4f46e5, #6366f1)" }}
              >
                {loading ? "Sending Code..." : "Send Reset Code"}
              </button>
            </form>

            <p className="text-slate-500 text-sm text-center mt-8">
              Remembered your password?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* ── BACK LINK ── */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 border hover:scale-105 active:scale-95"
            style={{
              background: darkMode ? "#1E0B3B" : "#ffffff",
              border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`,
              color: darkMode ? "#94a3b8" : "#64748b",
            }}
          >
            <ArrowRight size={14} className="text-indigo-400 rotate-180 group-hover:translate-x-1 transition-transform duration-200" />
            <span className={darkMode ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-indigo-600"} style={{ transition: "color 0.2s" }}>
              Back to Login
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
