import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ApiClient from "../api";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import { ShieldCheck, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);
  const api = new ApiClient();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const inputRefs = useRef([]);

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

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      toast.error("Session expired. Please request a reset again.");
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length < 6) {
      toast.error("Please enter the full 6-digit reset code");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (strength < 5) {
      toast.error("Please use a stronger password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.resetPassword(email, otpString, password);
      if (res) {
        toast.success(res.message || "Password reset successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-500"
      style={{ background: darkMode ? "#0F0121" : "#F8FAFC" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .auth-wrap * { font-family: 'Outfit', sans-serif; }
        .auth-input { background: transparent; color: ${darkMode ? "white" : "#0f172a"}; width: 100%; font-size: 0.875rem; }
        .auth-input:focus { outline: none; }
        .auth-input::placeholder { color: #64748b; }
        .otp-box { 
          width: 45px; height: 55px; text-align: center; font-size: 1.25rem; font-weight: 700;
          border-radius: 10px; border: 1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"};
          background: ${darkMode ? "#0F0121" : "#f1f5f9"}; color: ${darkMode ? "white" : "#0f172a"};
          transition: all 0.2s;
        }
        .otp-box:focus { border-color: #6366f1; transform: translateY(-2px); outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
      `}</style>

      <div className="auth-wrap w-full max-w-4xl">
        <div
          className="flex rounded-[28px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          style={{ minHeight: "560px" }}
        >
          {/* ── LEFT PANEL ── */}
          <div
            className="relative hidden md:flex flex-col justify-center px-12 py-10 overflow-hidden"
            style={{ width: "42%", background: "#4338ca" }}
          >
             <div className="absolute" style={{ width: 340, height: 340, borderRadius: "50%", background: "linear-gradient(135deg, #818cf8, #6366f1)", top: -90, left: -70, opacity: 0.6 }} />
             <div className="absolute" style={{ width: 210, height: 210, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", bottom: 10, left: -30, opacity: 0.5 }} />
             <div className="absolute" style={{ width: 155, height: 155, borderRadius: "50%", background: "linear-gradient(135deg, #a5b4fc, #818cf8)", bottom: 50, left: 165, opacity: 0.45 }} />

            <div className="relative z-10">
              <h2 className="text-white font-extrabold leading-tight" style={{ fontSize: "2.4rem", fontFamily: "'Outfit', sans-serif" }}>
                Set New<br />Password
              </h2>
              <p className="text-indigo-200 font-medium mt-3 text-sm leading-relaxed">
                Almost there. Create a strong password to keep your account secure.
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
                  <button key={i} className="rounded-full" style={{ width: i === activeFeature ? "20px" : "6px", height: "6px", background: i === activeFeature ? "white" : "rgba(255,255,255,0.35)", transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div
            className="flex flex-col justify-center px-10 py-10 flex-1 overflow-y-auto"
            style={{ background: darkMode ? "#1E0B3B" : "#ffffff" }}
          >
            <div className="mb-6">
              <h1 className={`${darkMode ? "text-white" : "text-slate-900"} font-bold mb-2`} style={{ fontSize: "1.75rem", fontFamily: "'Outfit', sans-serif" }}>
                Reset Details
              </h1>
              <p className="text-slate-500 text-xs">
                Enter code sent to <span className="font-bold text-indigo-400">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* OTP Input Group */}
              <div className="flex justify-between gap-1 mb-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-box"
                  />
                ))}
              </div>

              {/* New Password */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                style={{
                  background: darkMode ? "#0F0121" : "#f1f5f9",
                  border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`
                }}
              >
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength and Confirm fields - Condensed for space */}
              {password && (
                <div className="px-1">
                  <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${(strength / 5) * 100}%`,
                        background: strength === 5 ? "#10b981" : "#f43f5e"
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                style={{
                  background: darkMode ? "#0F0121" : "#f1f5f9",
                  border: `1.5px solid ${darkMode ? "#2d3650" : "#e2e8f0"}`
                }}
              >
                <Lock size={16} className="text-slate-400 shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="auth-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 mt-2"
                style={{ background: "linear-gradient(90deg, #4f46e5, #6366f1)" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <p className="text-slate-500 text-xs text-center mt-6">
              Didn't receive a code? <Link to="/forgot-password" className="text-indigo-400 font-bold hover:underline">Try again</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
