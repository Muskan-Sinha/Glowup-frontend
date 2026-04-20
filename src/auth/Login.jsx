import React, { useState } from "react";
import img from "../assets/bg1.jpg";
import { useDispatch } from "react-redux";
import { login } from "../services/auth/UserThunk.jsx";
import { useNavigate } from "react-router-dom";

const SparkleIcon = ({ style }) => (
  <div className="absolute pointer-events-none" style={style}>
    ✦
  </div>
);
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(null);
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: values.email,
      password: values.password,
      rememberMe,
    };

    setSubmitted(true);

    try {
      await dispatch(login(userData)).unwrap();
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setTimeout(() => setSubmitted(false), 1200);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-300/40 via-rose-100/30 to-pink-300/40 backdrop-blur-sm" />

      <SparkleIcon
        style={{
          top: "8%",
          left: "6%",
          fontSize: "1.4rem",
          color: "#f9a8d4",
          opacity: 0.7,
          animation: "spin 6s linear infinite",
        }}
      />
      <SparkleIcon
        style={{
          top: "15%",
          right: "9%",
          fontSize: "1rem",
          color: "#ec4899",
          opacity: 0.5,
          animation: "spin 8s linear infinite reverse",
        }}
      />
      <SparkleIcon
        style={{
          bottom: "12%",
          left: "10%",
          fontSize: "1.1rem",
          color: "#fbcfe8",
          opacity: 0.6,
          animation: "spin 7s linear infinite",
        }}
      />
      <SparkleIcon
        style={{
          bottom: "20%",
          right: "7%",
          fontSize: "0.9rem",
          color: "#f472b6",
          opacity: 0.5,
          animation: "spin 5s linear infinite reverse",
        }}
      />
      <SparkleIcon
        style={{
          top: "45%",
          left: "3%",
          fontSize: "0.8rem",
          color: "#fda4af",
          opacity: 0.4,
          animation: "spin 9s linear infinite",
        }}
      />

      <div
        className="relative w-[900px] max-w-[95vw] min-h-[520px] rounded-[2.5rem] overflow-hidden flex shadow-2xl"
        style={{
          boxShadow:
            "0 8px 60px 0 rgba(168,85,247,0.25), 0 2px 20px rgba(236,72,153,0.2)",
          border: "1.5px solid rgba(233,213,255,0.5)",
        }}
      >
        <div className="w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${img})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(126,34,206,0.82) 0%, rgba(168,85,247,0.78) 40%, rgba(236,72,153,0.75) 100%)",
            }}
          />

          <div
            className="absolute -top-14 -left-14 w-52 h-52 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #fff, transparent)" }}
          />
          <div
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, #e9d5ff, transparent)",
            }}
          />

          {[
            "top-10 right-8",
            "top-28 right-5",
            "bottom-20 right-10",
            "bottom-12 left-8",
          ].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} text-white/30 animate-pulse`}
              style={{
                fontSize: ["2.5rem", "1.5rem", "2rem", "1.2rem"][i],
                animationDelay: `${i * 0.4}s`,
              }}
            >
              ✦
            </div>
          ))}

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-10 gap-5">
            <div className="text-5xl mb-1 drop-shadow-lg">🔮</div>
            <h2 className="text-3xl font-extrabold leading-tight drop-shadow-sm">
              Welcome
              <br />
              Back!
            </h2>
            <div className="w-10 h-1 rounded-full bg-white/40 mx-auto" />
            <p className="text-sm opacity-85 font-medium leading-relaxed max-w-[190px]">
              We missed you! Log in and pick up right where you left off 💜
            </p>

            <div className="flex flex-col gap-2 mt-2 w-full max-w-[200px]">
              {[
                "🌙 Stay signed in",
                "💜 Your data is safe",
                "🚀 Instant access",
              ].map((item) => (
                <div
                  key={item}
                  className="text-xs font-semibold py-2 px-4 rounded-full text-white/90 text-left hover:scale-105 transition-transform"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.22)",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="w-1/2 flex flex-col justify-center px-10 py-10 relative"
          style={{
            background:
              "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #fdf4ff 100%)",
          }}
        >
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #d8b4fe, #e9d5ff)" }}
          />
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #a855f7, #c084fc)" }}
          />

          <div className="relative z-10">
            <div className="mb-2 text-3xl">💜</div>
            <h2
              className="text-3xl font-extrabold mb-1 tracking-tight"
              style={{
                background: "linear-gradient(90deg, #7e22ce, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sign In
            </h2>
            <p className="text-purple-400 text-sm mb-7 font-medium">
              Good to have you back, bestie ✨
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                  💌
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="Your e-mail"
                  value={values.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl text-purple-800 placeholder-purple-300 font-medium text-sm transition-all outline-none"
                  style={{
                    background:
                      focused === "email" ? "#fff" : "rgba(255,255,255,0.65)",
                    border:
                      focused === "email"
                        ? "2px solid #a855f7"
                        : "2px solid #e9d5ff",
                    boxShadow:
                      focused === "email"
                        ? "0 0 0 4px rgba(168,85,247,0.12)"
                        : "none",
                  }}
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                  🔑
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl text-purple-800 placeholder-purple-300 font-medium text-sm transition-all outline-none"
                  style={{
                    background:
                      focused === "password"
                        ? "#fff"
                        : "rgba(255,255,255,0.65)",
                    border:
                      focused === "password"
                        ? "2px solid #a855f7"
                        : "2px solid #e9d5ff",
                    boxShadow:
                      focused === "password"
                        ? "0 0 0 4px rgba(168,85,247,0.12)"
                        : "none",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-500 transition-colors text-base"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200"
                    style={{
                      background: rememberMe
                        ? "linear-gradient(135deg, #a855f7, #ec4899)"
                        : "rgba(255,255,255,0.8)",
                      border: rememberMe
                        ? "2px solid transparent"
                        : "2px solid #d8b4fe",
                      boxShadow: rememberMe
                        ? "0 2px 8px rgba(168,85,247,0.3)"
                        : "none",
                    }}
                  >
                    {rememberMe && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>
                  <span className="text-xs text-purple-500 font-medium group-hover:text-purple-700 transition-colors">
                    Remember me
                  </span>
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs font-semibold transition-colors"
                  style={{ color: "#a855f7" }}
                  onMouseOver={(e) => (e.target.style.color = "#7e22ce")}
                  onMouseOut={(e) => (e.target.style.color = "#a855f7")}
                >
                  Forgot password? 🥺
                </a>
              </div>

              <button
                type="submit"
                className="relative mt-1 py-3.5 rounded-2xl font-bold text-white text-sm tracking-widest uppercase transition-all duration-300 active:scale-95 overflow-hidden"
                style={{
                  background: submitted
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #7e22ce, #a855f7, #ec4899)",
                  boxShadow: submitted
                    ? "0 4px 20px rgba(52,211,153,0.4)"
                    : "0 4px 20px rgba(168,85,247,0.4)",
                }}
              >
                <span className="relative z-10">
                  {submitted ? "✓ Logged In! 💜" : "Sign In ✨"}
                </span>
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                    animation: "shimmer 2.5s infinite",
                  }}
                />
              </button>

              <div className="flex items-center gap-3 my-1">
                <div
                  className="flex-1 h-px"
                  style={{ background: "#e9d5ff" }}
                />
                <span className="text-xs text-purple-300 font-medium">or</span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "#e9d5ff" }}
                />
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "2px solid #e9d5ff",
                  color: "#7e22ce",
                }}
              >
                <span className="text-base">🌐</span> Continue with Google
              </button>

              <p className="text-center text-xs text-purple-400 mt-1">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold underline underline-offset-2 transition-colors"
                  style={{ color: "#a855f7" }}
                  onMouseOver={(e) => (e.target.style.color = "#7e22ce")}
                  onMouseOut={(e) => (e.target.style.color = "#a855f7")}
                >
                  Sign up 💕
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
