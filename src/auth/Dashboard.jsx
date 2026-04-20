import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const NAV_ITEMS = [
  { icon: "🏡", label: "Home", href: "/dashboard" },
  { icon: "🌈", label: "Mood", href: "/moodtracker" },
  { icon: "📓", label: "Journal", href: "/journal" },
  { icon: "🌿", label: "Habits", href: "/habits" },
  { icon: "🎯", label: "Goals", href: "/goals" },
  { icon: "🧘", label: "Mindfulness", href: "/mindfulness" },
];

const FEATURE_BANNERS = [
  {
    id: "mood",
    href: "/moodtracker",
    emoji: "🌈",
    title: "Mood Tracker",
    tagline: "How are you feeling today?",
    desc: "Log your emotions, spot patterns, and understand yourself better one day at a time.",
    cta: "Check In Now",
    gradient: "linear-gradient(135deg, #fce7f3 0%, #fdf4ff 50%, #ede9fe 100%)",
    accentGrad: "linear-gradient(90deg, #ec4899, #a855f7)",
    accentColor: "#ec4899",
    borderColor: "rgba(236,72,153,0.25)",
    size: "large",   // spans 2 cols
    moods: ["😊","😌","😢","😤","😍","😴","🥰","😰"],
  },
  {
    id: "journal",
    href: "/journal",
    emoji: "📓",
    title: "Journalling",
    tagline: "Pour your heart out",
    desc: "A private space to write freely — guided prompts, free-write, or gratitude logs.",
    cta: "Open Journal",
    gradient: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)",
    accentGrad: "linear-gradient(90deg, #f59e0b, #f97316)",
    accentColor: "#f59e0b",
    borderColor: "rgba(245,158,11,0.25)",
    size: "small",
  },
  {
    id: "habits",
    href: "/habits",
    emoji: "🌿",
    title: "Habit Tracker",
    tagline: "Build your streak",
    desc: "Stack tiny habits, track daily wins, and watch yourself bloom over time.",
    cta: "Track Today",
    gradient: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    accentGrad: "linear-gradient(90deg, #22c55e, #16a34a)",
    accentColor: "#22c55e",
    borderColor: "rgba(34,197,94,0.25)",
    size: "small",
  },
  {
    id: "goals",
    href: "/goals",
    emoji: "🎯",
    title: "Goal Setting",
    tagline: "Dream it. Do it.",
    desc: "Set meaningful goals, break them into steps, and celebrate every milestone.",
    cta: "Set a Goal",
    gradient: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    accentGrad: "linear-gradient(90deg, #3b82f6, #6366f1)",
    accentColor: "#3b82f6",
    borderColor: "rgba(59,130,246,0.25)",
    size: "small",
  },
  {
    id: "mindfulness",
    href: "/mindfulness",
    emoji: "🧘",
    title: "Mindfulness",
    tagline: "Breathe. Be here.",
    desc: "Guided breathwork, meditations, and calming rituals to ground yourself.",
    cta: "Start Session",
    gradient: "linear-gradient(135deg, #fdf4ff 0%, #f5f3ff 100%)",
    accentGrad: "linear-gradient(90deg, #a855f7, #7c3aed)",
    accentColor: "#a855f7",
    borderColor: "rgba(168,85,247,0.25)",
    size: "small",
  },
];

const QUICK_MOODS = ["😊","😌","🥰","😴","😤","😢","😰","✨"];

const AFFIRMATIONS = [
  "You are enough, exactly as you are. 🌸",
  "Today is full of beautiful possibilities. 💕",
  "Your feelings are valid and you are seen. 🌷",
  "Small steps still count as progress. 🦋",
  "You deserve all the love you give to others. 💖",
  "Rest is productive. You are allowed to pause. 🌙",
];

const STREAKS = [
  { icon: "🌿", label: "Habits", days: 7, color: "#22c55e" },
  { icon: "📓", label: "Journal", days: 3, color: "#f59e0b" },
  { icon: "🌈", label: "Mood", days: 12, color: "#ec4899" },
];

export default function Dashboard() {
  const user = useSelector((s) => s.user ?? null);
  const name = user?.name ?? "Beautiful";

  const [activeMood, setActiveMood] = useState(null);
  const [affirmIdx, setAffirmIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredBanner, setHoveredBanner] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setAffirmIdx(i => (i + 1) % AFFIRMATIONS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetEmoji = hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙";

  const handleMoodSave = () => {
    if (!activeMood) return;
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 2500);
  };

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fff0f6 0%, #fdf2f8 35%, #f5f3ff 70%, #faf5ff 100%)",
      display: "flex",
    }}>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 40, backdropFilter: "blur(4px)" }}
        />
      )}

      <aside style={{
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        width: "240px",
        background: "rgba(255,240,246,0.92)",
        backdropFilter: "blur(24px)",
        borderRight: "1.5px solid rgba(249,168,212,0.3)",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1.25rem",
        zIndex: 50,
        transform: sidebarOpen ? "translateX(0)" : undefined,
        boxShadow: "4px 0 30px rgba(190,24,93,0.07)",
        transition: "transform 0.3s ease",
      }}
        className="sidebar-desktop"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "1.6rem" }}>🌸</span>
          <span style={{
            fontWeight: 800, fontSize: "1.3rem",
            background: "linear-gradient(90deg, #be185d, #a855f7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Blossom</span>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.label === "Home";
            return (
              <a key={item.label} href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.65rem 1rem",
                  borderRadius: "1rem",
                  textDecoration: "none",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9rem",
                  color: isActive ? "#be185d" : "#9d6b87",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(252,231,243,0.9), rgba(243,232,255,0.7))"
                    : "transparent",
                  border: isActive ? "1.5px solid rgba(249,168,212,0.4)" : "1.5px solid transparent",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(252,231,243,0.5)";
                    e.currentTarget.style.color = "#be185d";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#9d6b87";
                  }
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div style={{
          marginTop: "auto",
          background: "linear-gradient(135deg, rgba(252,231,243,0.8), rgba(243,232,255,0.6))",
          border: "1.5px solid rgba(249,168,212,0.35)",
          borderRadius: "1.2rem",
          padding: "1rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "50%",
            background: "linear-gradient(135deg, #fce7f3, #f3e8ff)",
            border: "2px solid #f9a8d4",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", flexShrink: 0,
          }}>🦋</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {name}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#c084fc" }}>Member ✨</div>
          </div>
        </div>
      </aside>

      <main style={{
        marginLeft: "240px",
        flex: 1,
        padding: "2.5rem 2.5rem 4rem",
        minHeight: "100vh",
        position: "relative",
      }}
        className="main-content"
      >
        <div style={{
          display: "none", alignItems: "center", justifyContent: "space-between",
          marginBottom: "1.5rem",
        }} className="mobile-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "1.3rem" }}>🌸</span>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", background: "linear-gradient(90deg,#be185d,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Blossom</span>
          </div>
          <button onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#be185d" }}>
            ☰
          </button>
        </div>
        <div style={{
          marginBottom: "2rem",
          animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <span style={{ fontSize: "1.4rem" }}>{greetEmoji}</span>
            <span style={{ fontSize: "0.82rem", color: "#c084fc", fontWeight: 600, letterSpacing: "0.08em" }}>
              {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: 0,
          }}>
            <span style={{ color: "#1a1a2e" }}>{greeting}, </span>
            <span style={{
              background: "linear-gradient(90deg, #be185d, #ec4899, #a855f7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              {name.split(" ")[0]} 🌸
            </span>
          </h1>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "1.25rem",
          marginBottom: "1.75rem",
          animation: "fadeUp 0.6s 0.1s ease both",
          opacity: 0,
        }}>
          
          <div style={{
            background: "linear-gradient(135deg, rgba(253,164,175,0.25), rgba(196,181,253,0.2))",
            border: "1.5px solid rgba(249,168,212,0.4)",
            borderRadius: "1.5rem",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            backdropFilter: "blur(10px)",
            overflow: "hidden",
            position: "relative",
          }}>
            <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>💌</span>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: "#ec4899", marginBottom: "0.25rem" }}>TODAY'S AFFIRMATION</div>
              <p style={{
                fontSize: "0.95rem",
                color: "#5b2333",
                fontWeight: 500,
                lineHeight: 1.5,
                margin: 0,
                fontStyle: "italic",
                transition: "opacity 0.5s",
              }}>
                {AFFIRMATIONS[affirmIdx]}
              </p>
            </div>
           
            <div style={{ display: "flex", gap: "0.3rem", position: "absolute", bottom: "0.75rem", right: "1.25rem" }}>
              {AFFIRMATIONS.map((_, i) => (
                <div key={i} style={{
                  width: i === affirmIdx ? "1.2rem" : "0.4rem",
                  height: "0.4rem",
                  borderRadius: "1rem",
                  background: i === affirmIdx ? "#ec4899" : "rgba(236,72,153,0.25)",
                  transition: "all 0.4s",
                }} />
              ))}
            </div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.65)",
            border: "1.5px solid rgba(249,168,212,0.3)",
            borderRadius: "1.5rem",
            padding: "1.25rem 1.5rem",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            minWidth: "160px",
          }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: "#be185d" }}>🔥 STREAKS</div>
            {STREAKS.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.72rem", color: "#9d6b87", fontWeight: 600 }}>{s.label}</div>
                  <div style={{
                    height: "0.35rem", borderRadius: "1rem", background: "rgba(0,0,0,0.06)",
                    marginTop: "0.2rem", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: "1rem",
                      width: `${Math.min((s.days / 14) * 100, 100)}%`,
                      background: s.color,
                      transition: "width 1s ease",
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: s.color }}>{s.days}d</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.6)",
          border: "1.5px solid rgba(249,168,212,0.3)",
          borderRadius: "1.5rem",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.75rem",
          backdropFilter: "blur(10px)",
          animation: "fadeUp 0.6s 0.2s ease both",
          opacity: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: "#ec4899", marginBottom: "0.2rem" }}>QUICK MOOD CHECK-IN</div>
              <p style={{ fontSize: "0.88rem", color: "#9d6b87", margin: 0 }}>How's your heart feeling right now?</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              {QUICK_MOODS.map((m) => (
                <button key={m}
                  onClick={() => setActiveMood(m)}
                  style={{
                    fontSize: "1.5rem",
                    background: activeMood === m ? "linear-gradient(135deg, rgba(252,231,243,0.95), rgba(243,232,255,0.9))" : "rgba(255,255,255,0.7)",
                    border: activeMood === m ? "2px solid #ec4899" : "2px solid transparent",
                    borderRadius: "0.75rem",
                    width: "2.6rem", height: "2.6rem",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                    transform: activeMood === m ? "scale(1.2)" : "scale(1)",
                    boxShadow: activeMood === m ? "0 4px 12px rgba(236,72,153,0.25)" : "none",
                  }}
                  onMouseOver={(e) => { if (activeMood !== m) e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseOut={(e) => { if (activeMood !== m) e.currentTarget.style.transform = "scale(1)"; }}
                >
                  {m}
                </button>
              ))}
              <button
                onClick={handleMoodSave}
                disabled={!activeMood}
                style={{
                  background: moodSaved
                    ? "linear-gradient(90deg, #22c55e, #16a34a)"
                    : activeMood
                      ? "linear-gradient(90deg, #be185d, #ec4899)"
                      : "rgba(0,0,0,0.06)",
                  color: activeMood ? "#fff" : "#ccc",
                  border: "none",
                  borderRadius: "0.75rem",
                  padding: "0.5rem 1.1rem",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: activeMood ? "pointer" : "default",
                  transition: "all 0.25s",
                  fontFamily: "inherit",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                {moodSaved ? "✓ Saved!" : "Save →"}
              </button>
            </div>
          </div>
        </div>

        <div style={{
          animation: "fadeUp 0.6s 0.3s ease both",
          opacity: 0,
        }}>
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.01em", margin: 0 }}>
              Your Wellness World
            </h2>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(249,168,212,0.5), transparent)" }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "auto auto",
            gap: "1.25rem",
          }}>
            {FEATURE_BANNERS.map((f, idx) => {
              const isLarge = f.size === "large";
              const isHovered = hoveredBanner === f.id;

              return (
                <a
                  key={f.id}
                  href={f.href}
                  onMouseEnter={() => setHoveredBanner(f.id)}
                  onMouseLeave={() => setHoveredBanner(null)}
                  style={{
                    gridColumn: isLarge ? "span 2" : "span 1",
                    gridRow: isLarge ? "span 2" : "span 1",
                    background: f.gradient,
                    border: `2px solid ${isHovered ? f.accentColor + "60" : f.borderColor}`,
                    borderRadius: "1.5rem",
                    padding: isLarge ? "2rem" : "1.4rem",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: isLarge ? "flex-end" : "space-between",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: isHovered ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
                    boxShadow: isHovered
                      ? `0 16px 40px ${f.accentColor}30`
                      : "0 4px 16px rgba(190,24,93,0.05)",
                    overflow: "hidden",
                    position: "relative",
                    minHeight: isLarge ? "280px" : "auto",
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: isLarge ? "-3rem" : "-2rem",
                    right: isLarge ? "-3rem" : "-2rem",
                    width: isLarge ? "12rem" : "7rem",
                    height: isLarge ? "12rem" : "7rem",
                    borderRadius: "50%",
                    background: `${f.accentColor}18`,
                    transition: "transform 0.4s ease",
                    transform: isHovered ? "scale(1.2)" : "scale(1)",
                  }} />
                  <div style={{
                    position: "absolute",
                    bottom: isLarge ? "-2rem" : "-1.5rem",
                    left: isLarge ? "-2rem" : "-1rem",
                    width: isLarge ? "8rem" : "5rem",
                    height: isLarge ? "8rem" : "5rem",
                    borderRadius: "50%",
                    background: `${f.accentColor}10`,
                  }} />

                  {isLarge && (
                    <div style={{ position: "absolute", top: "1.75rem", right: "2rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", maxWidth: "160px", justifyContent: "flex-end" }}>
                      {(f.moods ?? []).map((m, i) => (
                        <div key={i} style={{
                          fontSize: "1.5rem",
                          background: "rgba(255,255,255,0.7)",
                          borderRadius: "0.75rem",
                          width: "2.4rem", height: "2.4rem",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(236,72,153,0.1)",
                          transition: "transform 0.2s",
                          transform: isHovered ? `translateY(${i % 2 === 0 ? "-3px" : "3px"})` : "none",
                          transitionDelay: `${i * 30}ms`,
                        }}>{m}</div>
                      ))}
                    </div>
                  )}

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                      fontSize: isLarge ? "2.5rem" : "1.8rem",
                      marginBottom: isLarge ? "1rem" : "0.5rem",
                      display: "inline-block",
                      transition: "transform 0.3s",
                      transform: isHovered ? "scale(1.15) rotate(-5deg)" : "scale(1) rotate(0deg)",
                    }}>
                      {f.emoji}
                    </div>
                    <div style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: f.accentColor,
                      marginBottom: "0.2rem",
                      opacity: 0.85,
                    }}>
                      {f.tagline.toUpperCase()}
                    </div>
                    <h3 style={{
                      fontWeight: 900,
                      fontSize: isLarge ? "1.6rem" : "1rem",
                      color: "#1a1a2e",
                      letterSpacing: "-0.02em",
                      margin: "0 0 0.4rem",
                      lineHeight: 1.1,
                    }}>
                      {f.title}
                    </h3>
                    <p style={{
                      fontSize: isLarge ? "0.9rem" : "0.78rem",
                      color: "#6b4c5e",
                      lineHeight: 1.6,
                      margin: "0 0 1rem",
                      maxWidth: isLarge ? "280px" : "100%",
                      opacity: isHovered ? 1 : 0.8,
                      transition: "opacity 0.3s",
                    }}>
                      {f.desc}
                    </p>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: isHovered ? f.accentColor : "rgba(255,255,255,0.7)",
                      color: isHovered ? "#fff" : f.accentColor,
                      border: `1.5px solid ${f.accentColor}50`,
                      borderRadius: "2rem",
                      padding: "0.45rem 1rem",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      transition: "all 0.25s",
                      letterSpacing: "0.03em",
                    }}>
                      {f.cta}
                      <span style={{
                        display: "inline-block",
                        transition: "transform 0.2s",
                        transform: isHovered ? "translateX(3px)" : "translateX(0)",
                      }}>→</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
        <div style={{
          marginTop: "2rem",
          textAlign: "center",
          padding: "1.5rem",
          animation: "fadeUp 0.6s 0.5s ease both",
          opacity: 0,
        }}>
          <p style={{ fontSize: "0.82rem", color: "#c084fc", fontStyle: "italic", fontWeight: 500 }}>
            "The most powerful relationship you will ever have is the relationship with yourself." 🌷
          </p>
        </div>
      </main>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @media (max-width: 768px) {
          .sidebar-desktop {
            transform: translateX(-100%) !important;
          }
          .sidebar-desktop[style*="translateX(0)"] {
            transform: translateX(0) !important;
          }
          .main-content {
            margin-left: 0 !important;
            padding: 1.5rem 1.25rem 4rem !important;
          }
          .mobile-topbar {
            display: flex !important;
          }
        }
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
