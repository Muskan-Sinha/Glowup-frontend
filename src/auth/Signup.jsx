import React, { useState } from "react";
import img from "../assets/bg1.jpg";
import { useDispatch } from "react-redux";
import { signup } from "../services/auth/UserThunk.jsx";
import { useNavigate } from "react-router-dom";

const FloatingHeart = ({ style }) => (
  <div className="absolute pointer-events-none animate-bounce" style={style}>
    💗
  </div>
);

const Signup = () => {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setErrorMsg("");

    try {
      await dispatch(signup(values)).unwrap(); 
      navigate("/home", { replace: true });
    } catch (err) {
      setErrorMsg(err);
    } finally {
      setTimeout(() => setSubmitted(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-200 to-fuchsia-400 backdrop-blur-sm" />

      <FloatingHeart style={{ top: "10%", left: "8%", fontSize: "1.5rem", animationDelay: "0s", animationDuration: "3s" }} />
      <FloatingHeart style={{ top: "20%", right: "10%", fontSize: "1rem", animationDelay: "0.5s", animationDuration: "4s" }} />
      <FloatingHeart style={{ bottom: "15%", left: "12%", fontSize: "1.2rem", animationDelay: "1s", animationDuration: "3.5s" }} />
      <FloatingHeart style={{ bottom: "25%", right: "8%", fontSize: "0.9rem", animationDelay: "1.5s", animationDuration: "2.5s" }} />
      <FloatingHeart style={{ top: "50%", left: "4%", fontSize: "0.8rem", animationDelay: "0.8s", animationDuration: "4.5s" }} />
      <div
        className="relative w-[900px] max-w-[95vw] h-auto min-h-[520px] rounded-[2.5rem] overflow-hidden flex shadow-2xl shadow-pink-900 border-2 border-pink-800"
        style={{
          boxShadow: "0 8px 60px 0 rgba(236,72,153,0.35), 0 2px 20px rgba(244,114,182,0.2)",
          border: "1.5px solid rgba(249,168,212,0.5)",
        }}
      >
        <div className="w-1/2 flex flex-col justify-center px-10 py-10 relative"
          style={{
            background: "linear-gradient(135deg, #fff0f6 0%, #fce7f3 50%, #fdf2f8 100%)",
          }}
        >
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #f9a8d4, #fbcfe8)" }} />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ec4899, #f472b6)" }} />

          <div className="relative z-10">
            <div className="mb-2 text-3xl">🌸</div>
            <h2 className="text-3xl font-extrabold mb-1 tracking-tight"
              style={{
                background: "linear-gradient(90deg, #be185d, #ec4899, #f43f5e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Join the Club
            </h2>
            <p className="text-pink-400 text-sm mb-7 font-medium">Create your account — it's free & fabulous ✨</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-all"
                  style={{ filter: focused === "name" ? "none" : "grayscale(0.4)" }}>
                  🦋
                </span>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={values.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl text-pink-800 placeholder-pink-300 font-medium text-sm transition-all outline-none"
                  style={{
                    background: focused === "name" ? "#fff" : "rgba(255,255,255,0.7)",
                    border: focused === "name" ? "2px solid #ec4899" : "2px solid #fbcfe8",
                    boxShadow: focused === "name" ? "0 0 0 4px rgba(236,72,153,0.1)" : "none",
                  }}
                  required
                />
              </div>
              <div className="relative group">
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
                  className="w-full pl-12 pr-4 py-3 rounded-2xl text-pink-800 placeholder-pink-300 font-medium text-sm transition-all outline-none"
                  style={{
                    background: focused === "email" ? "#fff" : "rgba(255,255,255,0.7)",
                    border: focused === "email" ? "2px solid #ec4899" : "2px solid #fbcfe8",
                    boxShadow: focused === "email" ? "0 0 0 4px rgba(236,72,153,0.1)" : "none",
                  }}
                  required
                />
              </div>

              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
                  🔐
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl text-pink-800 placeholder-pink-300 font-medium text-sm transition-all outline-none"
                  style={{
                    background: focused === "password" ? "#fff" : "rgba(255,255,255,0.7)",
                    border: focused === "password" ? "2px solid #ec4899" : "2px solid #fbcfe8",
                    boxShadow: focused === "password" ? "0 0 0 4px rgba(236,72,153,0.1)" : "none",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500 transition-colors text-base"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {values.password.length > 0 && (
                <div className="flex gap-1.5 px-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: values.password.length >= i * 3
                          ? i <= 1 ? "#fca5a5"
                            : i <= 2 ? "#f472b6"
                              : i <= 3 ? "#ec4899"
                                : "#be185d"
                          : "#fce7f3",
                      }}
                    />
                  ))}
                  <span className="text-xs text-pink-400 ml-1 font-medium">
                    {values.password.length < 3 ? "too short 🥺" : values.password.length < 6 ? "getting there 💕" : values.password.length < 9 ? "almost! 🌸" : "strong! 💪"}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="relative mt-2 py-3.5 rounded-2xl font-bold text-white text-sm tracking-widest uppercase transition-all duration-200 active:scale-95 overflow-hidden"
                style={{
                  background: submitted
                    ? "linear-gradient(90deg, #10b981, #34d399)"
                    : "linear-gradient(90deg, #be185d, #ec4899, #f43f5e)",
                  boxShadow: "0 4px 20px rgba(236,72,153,0.4)",
                  transform: submitted ? "scale(0.98)" : "scale(1)",
                }}
              >
                <span className="relative z-10">
                  {submitted ? "✓ Welcome! 💖" : "Create Account ✨"}
                </span>

                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                    animation: "shimmer 2.5s infinite",
                  }}
                />
              </button>
              {errorMsg && (
                <p className="text-red-500 text-sm text-center mt-2 font-medium">
                  {errorMsg}
                </p>
              )}
              <p className="text-center text-xs text-pink-400 mt-1">
                Already have an account?{" "}
                <a href="/login" className="text-pink-600 font-semibold hover:text-pink-800 underline underline-offset-2 transition-colors">
                  Log in 💕
                </a>
              </p>
            </form>
          </div>
        </div>
        <div className="w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${img})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(190,24,93,0.85) 0%, rgba(236,72,153,0.80) 40%, rgba(244,63,94,0.75) 100%)",
            }}
          />

          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #fff, transparent)" }} />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #fce7f3, transparent)" }} />


          <div className="absolute top-12 right-10 text-white/40 text-4xl animate-pulse">♡</div>
          <div className="absolute top-12 left-6 text-white/25 text-5xl animate-pulse" style={{ animationDelay: "0.7s" }}>♡</div>
          <div className="absolute top-20 left-14 text-white/25 text-2xl animate-pulse" style={{ animationDelay: "0.7s" }}>♡</div>
          <div className="absolute top-28 right-6 text-white/25 text-2xl animate-pulse" style={{ animationDelay: "0.7s" }}>♡</div>
          <div className="absolute bottom-24 left-12 text-white/30 text-3xl animate-pulse" style={{ animationDelay: "1.2s" }}>♡</div>
          <div className="absolute bottom-24 right-12 text-white/30 text-3xl animate-pulse" style={{ animationDelay: "1.2s" }}>♡</div>
          <div className="absolute bottom-14 left-10 text-white/20 text-xl animate-pulse" style={{ animationDelay: "0.4s" }}>♡</div>


          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-10 gap-5">
            <div className="text-5xl mb-2 drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))" }}>
              🌷
            </div>
            <h2 className="text-3xl font-extrabold leading-tight drop-shadow-sm">
              Glad to<br />see You!
            </h2>
            <div className="w-10 h-1 rounded-full bg-white/50 mx-auto" />
            <p className="text-sm opacity-85 font-medium leading-relaxed max-w-[200px]">
              Join us and start your beautiful journey with us 💖
            </p>

            <div className="flex flex-col gap-2 mt-2 w-full max-w-[200px]">
              {["✨ Free forever", "💌 Daily inspiration", "🎀 Exclusive perks"].map((item) => (
                <div
                  key={item}
                  className="text-xs font-semibold py-2 px-4 rounded-full text-white/90 text-left transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)" }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
