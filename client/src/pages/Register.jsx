import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bgImage from "../assets/bg.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    login({ fullName: form.fullName, email: form.email, phone: form.phone });
    navigate("/");
  };

  const inputClass =
    "w-full px-5 py-4 pr-12 rounded-full text-white placeholder-purple-200 text-sm outline-none transition-all";

  const inputStyle = {
    background: "rgba(255, 255, 255, 0.12)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Glassmorphism card */}
      <div
        className="w-full max-w-md rounded-3xl px-10 py-12"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 8px 48px rgba(0, 0, 0, 0.35)",
        }}
      >
        <h1 className="text-4xl font-bold text-white text-center mb-8 tracking-wide">
          Join Us!
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className={inputClass}
              style={inputStyle}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-200 text-lg">👤</span>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className={inputClass}
              style={inputStyle}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-200 text-lg">✉️</span>
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className={inputClass}
              style={inputStyle}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-200 text-lg">📞</span>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={inputClass}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-200 text-lg"
            >
              {showPassword ? "🙈" : "🔒"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className={inputClass}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-200 text-lg"
            >
              {showConfirm ? "🙈" : "🔒"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-sm text-center px-4 py-2 rounded-full"
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#fca5a5",
              }}
            >
              ⚠️ {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-full font-bold text-purple-900 text-base transition-all hover:opacity-90 active:scale-95 mt-1"
            style={{ background: "linear-gradient(90deg, #ffffff, #e9d5ff)" }}
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-purple-100 text-sm mt-7">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-white hover:text-purple-200 transition-colors">
            Sign In
          </Link>
        </p>

        <p className="text-center mt-4">
          <span
            className="text-xs text-purple-300 cursor-pointer hover:text-white transition-colors"
            onClick={() => navigate("/")}
          >
            ← Back to Eventify
          </span>
        </p>
      </div>
    </div>
  );
}