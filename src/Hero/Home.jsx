import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const rand = (min, max) => Math.random() * (max - min) + min;

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${rand(0, 100)}%`,
  delay: `${rand(0, 8)}s`,
  duration: `${rand(6, 14)}s`,
  size: `${rand(0.6, 1.4)}rem`,
  emoji: ["🌸", "🌷", "💮", "🌺", "🌹"][i % 5],
}));

const FEATURES = [
  { icon: "✨", title: "Daily Glow-Ups", desc: "Curated beauty rituals and self-care routines delivered every morning.", color: "#f9a8d4" },
  { icon: "💌", title: "Love Letters", desc: "Handpicked affirmations and sweet notes to brighten your day.", color: "#c4b5fd" },
  { icon: "🎀", title: "Exclusive Drops", desc: "Members-only deals on the prettiest finds across the web.", color: "#fda4af" },
  { icon: "🌙", title: "Night Rituals", desc: "Wind-down guides, playlists, and bedtime routines crafted with love.", color: "#93c5fd" },
  { icon: "🦋", title: "Growth Journey", desc: "Track your personal evolution with journals and mood check-ins.", color: "#86efac" },
  { icon: "💅", title: "Style Board", desc: "Pin your aesthetic, build your moodboard, share your vibe.", color: "#fcd34d" },
];

const TESTIMONIALS = [
  { name: "Aria K.", avatar: "🌸", text: "This app genuinely changed my mornings — I feel so seen and glowy every day!", stars: 5 },
  { name: "Zoe M.", avatar: "💜", text: "The vibe is immaculate. It's like your best friend wrapped in a pastel bow.", stars: 5 },
  { name: "Lily R.", avatar: "🌺", text: "I've recommended this to literally everyone. The love letter feature is chef's kiss.", stars: 5 },
];

const NAV_LINKS = ["Home", "Features", "Community", "About", "Blog"];

export default function Home() {
  const user = useSelector((s) => s.user ?? null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeNav, setActiveNav] = useState("Home");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrollY > 40
    ? "rgba(255,240,246,0.85)"
    : "transparent";
  const navShadow = scrollY > 40
    ? "0 2px 24px rgba(236,72,153,0.10)"
    : "none";

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Palatino Linotype', serif",
        background: "linear-gradient(160deg, #fff0f6 0%, #fdf2f8 40%, #f3e8ff 80%, #faf5ff 100%)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {PETALS.map((p) => (
          <span
            key={p.id}
            style={{
              position: "absolute",
              left: p.left,
              top: "-2rem",
              fontSize: p.size,
              animation: `petalFall ${p.duration} ${p.delay} linear infinite`,
              opacity: 0.55,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: navBg,
          boxShadow: navShadow,
          backdropFilter: scrollY > 40 ? "blur(16px)" : "none",
          transition: "all 0.35s ease",
          padding: "0 2rem",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.6rem" }}>🌸</span>
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontWeight: 700,
              fontSize: "1.35rem",
              letterSpacing: "-0.02em",
              background: "linear-gradient(90deg, #be185d, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Blossom
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}
          className="hidden-mobile">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              style={{
                background: activeNav === link
                  ? "linear-gradient(90deg, #fce7f3, #f3e8ff)"
                  : "transparent",
                border: activeNav === link ? "1.5px solid #f9a8d4" : "1.5px solid transparent",
                color: activeNav === link ? "#be185d" : "#9d4edd",
                borderRadius: "2rem",
                padding: "0.4rem 1.1rem",
                fontFamily: "inherit",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseOver={(e) => {
                if (activeNav !== link) {
                  e.currentTarget.style.background = "rgba(249,168,212,0.15)";
                  e.currentTarget.style.color = "#be185d";
                }
              }}
              onMouseOut={(e) => {
                if (activeNav !== link) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9d4edd";
                }
              }}
            >
              {link}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user?.name ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "linear-gradient(90deg, #fce7f3, #f3e8ff)",
              border: "1.5px solid #f9a8d4",
              borderRadius: "2rem",
              padding: "0.4rem 1rem",
            }}>
              <span>🦋</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#be185d" }}>
                Hi, {user.name}!
              </span>
            </div>
          ) : (
            <>
              <a href="/login"
                style={{
                  color: "#a855f7",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  transition: "color 0.2s",
                  fontFamily: "inherit",
                }}
                onMouseOver={(e) => (e.target.style.color = "#7e22ce")}
                onMouseOut={(e) => (e.target.style.color = "#a855f7")}
              >
                Log in
              </a>
              <a href="/signup"
                style={{
                  background: "linear-gradient(90deg, #be185d, #a855f7)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  borderRadius: "2rem",
                  padding: "0.5rem 1.25rem",
                  boxShadow: "0 4px 16px rgba(190,24,93,0.25)",
                  letterSpacing: "0.02em",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  fontFamily: "inherit",
                  display: "inline-block",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(190,24,93,0.35)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(190,24,93,0.25)";
                }}
              >
                Join Free ✨
              </a>
            </>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "1.3rem", display: "none", color: "#be185d",
            }}
            className="show-mobile"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: "fixed", top: "70px", left: 0, right: 0, zIndex: 99,
            background: "rgba(255,240,246,0.97)",
            backdropFilter: "blur(20px)",
            padding: "1.5rem 2rem 2rem",
            display: "flex", flexDirection: "column", gap: "0.5rem",
            borderBottom: "1.5px solid #fce7f3",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button key={link}
              onClick={() => { setActiveNav(link); setMenuOpen(false); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                textAlign: "left", padding: "0.6rem 0",
                color: activeNav === link ? "#be185d" : "#9d4edd",
                fontWeight: 600, fontSize: "1rem", fontFamily: "inherit",
                borderBottom: "1px solid #fce7f3",
              }}
            >
              {link}
            </button>
          ))}
        </div>
      )}

      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "7rem 2rem 4rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "500px",
          borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
          background: "radial-gradient(ellipse, rgba(249,168,212,0.22) 0%, rgba(233,213,255,0.15) 60%, transparent 80%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          animation: "morphBlob 10s ease-in-out infinite",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          background: "linear-gradient(90deg, rgba(253,164,175,0.3), rgba(196,181,253,0.3))",
          border: "1.5px solid rgba(249,168,212,0.5)",
          borderRadius: "2rem",
          padding: "0.4rem 1.1rem",
          marginBottom: "1.5rem",
          backdropFilter: "blur(8px)",
          animation: "fadeSlideUp 0.6s ease both",
        }}>
          <span style={{ fontSize: "0.9rem" }}>🌟</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#be185d", letterSpacing: "0.08em" }}>
            YOUR LITTLE PINK CORNER OF THE INTERNET
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: "-0.03em",
          marginBottom: "1.5rem",
          maxWidth: "800px",
          animation: "fadeSlideUp 0.7s 0.1s ease both",
          opacity: 0,
        }}>
          <span style={{
            background: "linear-gradient(135deg, #be185d 0%, #ec4899 40%, #a855f7 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Bloom Into
          </span>
          <br />
          <span style={{ color: "#1a1a2e" }}>Your Best Self</span>
          <span style={{ fontSize: "0.7em", marginLeft: "0.2em" }}>🌷</span>
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: "#9d6b87",
          maxWidth: "520px",
          lineHeight: 1.7,
          marginBottom: "2.5rem",
          fontWeight: 400,
          animation: "fadeSlideUp 0.7s 0.2s ease both",
          opacity: 0,
        }}>
          A cozy, joyful space for self-love rituals, daily inspiration,
          and a community that cheers you on every single day. 💕
        </p>

        <div style={{
          display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center",
          animation: "fadeSlideUp 0.7s 0.3s ease both",
          opacity: 0,
        }}>
          <a href="/signup"
            style={{
              background: "linear-gradient(90deg, #be185d, #ec4899, #a855f7)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              borderRadius: "2rem",
              padding: "0.9rem 2.2rem",
              boxShadow: "0 6px 30px rgba(190,24,93,0.35)",
              letterSpacing: "0.04em",
              transition: "transform 0.2s, box-shadow 0.2s",
              fontFamily: "inherit",
              display: "inline-block",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 10px 40px rgba(190,24,93,0.45)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 30px rgba(190,24,93,0.35)";
            }}
          >
            Start Blooming ✨
          </a>
          <a href="#features"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "#be185d",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              borderRadius: "2rem",
              padding: "0.9rem 2.2rem",
              border: "2px solid #f9a8d4",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s",
              fontFamily: "inherit",
              display: "inline-block",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(252,231,243,0.9)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.7)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            See the Magic 🌸
          </a>
        </div>

        <div style={{
          display: "flex", gap: "2.5rem", marginTop: "4rem", flexWrap: "wrap", justifyContent: "center",
          animation: "fadeSlideUp 0.7s 0.45s ease both",
          opacity: 0,
        }}>
          {[
            { val: "120k+", label: "Blossoms" },
            { val: "4.9★", label: "Rating" },
            { val: "365", label: "Days of love" },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.03em",
                background: "linear-gradient(135deg, #be185d, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{val}</div>
              <div style={{ fontSize: "0.8rem", color: "#c084fc", fontWeight: 600, letterSpacing: "0.06em" }}>
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          position: "absolute", bottom: "2.5rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
          animation: "bounceY 2s ease-in-out infinite",
          opacity: 0.6,
        }}>
          <span style={{ fontSize: "0.7rem", color: "#ec4899", letterSpacing: "0.1em", fontWeight: 600 }}>SCROLL</span>
          <div style={{ width: "1.5px", height: "2rem", background: "linear-gradient(to bottom, #ec4899, transparent)" }} />
        </div>
      </section>

      <div style={{
        overflow: "hidden",
        background: "linear-gradient(90deg, #be185d, #ec4899, #a855f7, #ec4899, #be185d)",
        padding: "0.8rem 0",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          display: "flex", gap: "2rem",
          animation: "marquee 20s linear infinite",
          width: "max-content",
        }}>
          {Array(3).fill(["🌸 Self-love", "✨ Daily rituals", "💌 Affirmations", "🎀 Exclusive drops", "🦋 Growth", "💅 Style board", "🌙 Night rituals", "💜 Community"]).flat().map((item, i) => (
            <span key={i} style={{
              color: "#fff", fontWeight: 700, fontSize: "0.85rem",
              letterSpacing: "0.08em", whiteSpace: "nowrap",
              opacity: 0.9,
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <section id="features" style={{ padding: "6rem 2rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
         
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-block",
              fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em",
              color: "#ec4899",
              background: "rgba(252,231,243,0.8)",
              border: "1.5px solid #fce7f3",
              borderRadius: "2rem",
              padding: "0.35rem 1rem",
              marginBottom: "1rem",
            }}>
              ✦ EVERYTHING YOU NEED ✦
            </div>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #be185d, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Curated With Love 💕
            </h2>
            <p style={{ color: "#9d6b87", marginTop: "0.75rem", fontSize: "1rem", maxWidth: "400px", margin: "0.75rem auto 0" }}>
              Every feature built for your joy, growth, and that little sparkle in your eye.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: hoveredFeature === i
                    ? "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(253,232,242,0.9))"
                    : "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(12px)",
                  border: hoveredFeature === i
                    ? `2px solid ${f.color}`
                    : "2px solid rgba(249,168,212,0.25)",
                  borderRadius: "1.5rem",
                  padding: "2rem 1.75rem",
                  cursor: "default",
                  transition: "all 0.3s ease",
                  transform: hoveredFeature === i ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: hoveredFeature === i
                    ? `0 16px 40px ${f.color}55`
                    : "0 4px 16px rgba(190,24,93,0.06)",
                }}
              >
                <div style={{
                  fontSize: "2.2rem",
                  marginBottom: "1rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "3.5rem", height: "3.5rem",
                  borderRadius: "1rem",
                  background: `${f.color}30`,
                  border: `1.5px solid ${f.color}60`,
                }}>
                  {f.icon}
                </div>
                <h3 style={{
                  fontWeight: 800, fontSize: "1.1rem",
                  color: "#1a1a2e", marginBottom: "0.5rem", letterSpacing: "-0.01em",
                }}>
                  {f.title}
                </h3>
                <p style={{ color: "#9d6b87", fontSize: "0.88rem", lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        position: "relative", zIndex: 1,
        margin: "0 2rem 4rem",
        borderRadius: "2.5rem",
        overflow: "hidden",
        maxWidth: "1100px",
        marginLeft: "auto",
        marginRight: "auto",
      }}>
        <div style={{
          background: "linear-gradient(135deg, #be185d 0%, #ec4899 40%, #a855f7 100%)",
          padding: "4rem 3rem",
          textAlign: "center",
          position: "relative",
        }}>
          <div style={{ position: "absolute", top: "-3rem", right: "-3rem", width: "12rem", height: "12rem", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: "-2rem", left: "-2rem", width: "9rem", height: "9rem", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💖</div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
              lineHeight: 1.1,
            }}>
              Ready to Blossom?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Join thousands of beauties who have already found their glow. It's free, it's fun, it's fabulous.
            </p>
            <a href="/signup"
              style={{
                background: "#fff",
                color: "#be185d",
                fontWeight: 800,
                fontSize: "1rem",
                textDecoration: "none",
                borderRadius: "2rem",
                padding: "0.9rem 2.5rem",
                boxShadow: "0 6px 30px rgba(0,0,0,0.15)",
                letterSpacing: "0.04em",
                transition: "transform 0.2s",
                fontFamily: "inherit",
                display: "inline-block",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              Join the Club ✨
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: "2rem 2rem 6rem", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #be185d, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              What the Beauties Say 🌸
            </h2>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(12px)",
                border: "2px solid rgba(249,168,212,0.3)",
                borderRadius: "1.5rem",
                padding: "1.75rem",
                boxShadow: "0 4px 20px rgba(190,24,93,0.06)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(190,24,93,0.12)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(190,24,93,0.06)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: "3rem", height: "3rem", borderRadius: "50%",
                    background: "linear-gradient(135deg, #fce7f3, #f3e8ff)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.4rem",
                    border: "2px solid #f9a8d4",
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e" }}>{t.name}</div>
                    <div style={{ color: "#ec4899", fontSize: "0.8rem" }}>{"★".repeat(t.stars)}</div>
                  </div>
                </div>
                <p style={{ color: "#9d6b87", fontSize: "0.88rem", lineHeight: 1.7, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{
        background: "linear-gradient(135deg, #fce7f3, #f3e8ff)",
        borderTop: "1.5px solid rgba(249,168,212,0.3)",
        padding: "3rem 2rem 2rem",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem" }}>
            <div style={{ maxWidth: "240px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.4rem" }}>🌸</span>
                <span style={{
                  fontWeight: 800, fontSize: "1.2rem",
                  background: "linear-gradient(90deg, #be185d, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Blossom</span>
              </div>
              <p style={{ color: "#9d6b87", fontSize: "0.82rem", lineHeight: 1.65 }}>
                Your cozy corner of the internet for self-love, daily rituals, and all things beautiful. 💕
              </p>
            </div>

            {[
              { title: "Explore", links: ["Features", "Community", "Blog", "About"] },
              { title: "Account", links: ["Sign Up", "Log In", "Settings", "Help"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div style={{ fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", color: "#be185d", marginBottom: "0.75rem" }}>
                  {title.toUpperCase()}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {links.map((l) => (
                    <a key={l} href="#" style={{
                      color: "#9d6b87", fontSize: "0.85rem", textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                      onMouseOver={(e) => (e.target.style.color = "#be185d")}
                      onMouseOut={(e) => (e.target.style.color = "#9d6b87")}
                    >
                      {l}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div style={{ fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.1em", color: "#be185d", marginBottom: "0.75rem" }}>
                FOLLOW ALONG
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {["🎀", "🌸", "💌", "✨"].map((icon, i) => (
                  <div key={i} style={{
                    width: "2.5rem", height: "2.5rem",
                    borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.8)",
                    border: "1.5px solid #fce7f3",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "scale(1.15)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(190,24,93,0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(249,168,212,0.4)",
            paddingTop: "1.5rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: "0.5rem",
          }}>
            <p style={{ color: "#c084fc", fontSize: "0.78rem" }}>
              © 2026 Blossom. Made with 💕 and a lot of pink.
            </p>
            <p style={{ color: "#c084fc", fontSize: "0.78rem" }}>
              Privacy · Terms · Cookies
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes petalFall {
          0%   { transform: translateY(-10vh) rotate(0deg);   opacity: 0;   }
          10%  { opacity: 0.55; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes morphBlob {
          0%,100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
          33%     { border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
          66%     { border-radius: 70% 30% 50% 50% / 40% 70% 30% 60%; }
        }
        @keyframes bounceY {
          0%,100% { transform: translateY(0);    }
          50%     { transform: translateY(8px);  }
        }
        @keyframes marquee {
          from { transform: translateX(0);       }
          to   { transform: translateX(-33.33%); }
        }
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
        @media (min-width: 641px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
