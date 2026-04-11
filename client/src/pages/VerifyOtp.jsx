import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiClient from "../api";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);
  const api = new ApiClient();
  
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from navigation state or fallback
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      toast.error("Invalid session. Please register again.");
      navigate("/register");
    }
  }, [location, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOtp(email, otpString);
      if (res && res.user) {
        toast.success("Account verified successfully!");
        // Update auth context state to log in the user
        login(res.user);
        navigate("/");
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      const res = await api.resendOtp(email);
      if (res) {
        toast.success("Verification code resent!");
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("Resend error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: darkMode ? "#0F0121" : "#F8FAFC" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .otp-wrap * { font-family: 'Outfit', sans-serif; }
        .otp-box { 
          width: 50px; 
          height: 60px; 
          text-align: center; 
          font-size: 1.5rem; 
          font-weight: 700;
          border-radius: 12px;
          background: ${darkMode ? "#0F0121" : "#f1f5f9"};
          border: 2px solid ${darkMode ? "#2d3650" : "#e2e8f0"};
          color: ${darkMode ? "white" : "#0f172a"};
          transition: all 0.2s;
        }
        .otp-box:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
          outline: none;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="otp-wrap w-full max-w-md">
        <div 
          className="rounded-[32px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-10"
          style={{ background: darkMode ? "#1E0B3B" : "#ffffff" }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={32} className="text-indigo-500" />
            </div>
            
            <h1 className={`${darkMode ? "text-white" : "text-slate-900"} font-bold text-2xl mb-2`}>
              Verify Email
            </h1>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              We've sent a 6-digit code to <br />
              <span className="font-bold text-indigo-400">{email}</span>
            </p>

            <form onSubmit={handleVerify} className="w-full">
              <div className="flex justify-between gap-2 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-box"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                style={{ background: "linear-gradient(90deg, #4f46e5, #6366f1)" }}
              >
                {loading ? "Verifying..." : "Verify Account"}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Didn't receive code?</span>
                {canResend ? (
                  <button 
                    onClick={handleResend}
                    className="text-indigo-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={14} /> Resend
                  </button>
                ) : (
                  <span className="text-indigo-400 font-bold">
                    Resend in {timer}s
                  </span>
                )}
              </div>

              <button
                onClick={() => navigate("/register")}
                className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors"
              >
                <ArrowRight size={12} className="rotate-180" /> Change Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
