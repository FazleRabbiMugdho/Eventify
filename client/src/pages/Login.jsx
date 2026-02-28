import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bgImage from "../assets/bg.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ fullName: form.email.split("@")[0], email: form.email, phone: "" });
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
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
          Welcome Back❤️
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-5 py-4 pr-12 rounded-full text-white placeholder-purple-200 text-sm outline-none transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-200 text-lg">👤</span>
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
              className="w-full px-5 py-4 pr-12 rounded-full text-white placeholder-purple-200 text-sm outline-none transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-200 text-lg"
            >
              {showPassword ? "🙈" : "🔒"}
            </button>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-purple-100 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-purple-400 cursor-pointer"
              />
              Remember me
            </label>
            <a href="#" className="text-purple-100 text-sm hover:text-white transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-full font-bold text-purple-900 text-base transition-all hover:opacity-90 active:scale-95 mt-1"
            style={{ background: "linear-gradient(90deg, #ffffff, #e9d5ff)" }}
          >
            Login
          </button>

        </form>

        <p className="text-center text-purple-100 text-sm mt-7">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-white hover:text-purple-200 transition-colors">
            Register
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