import React from "react";
import { useSelector } from "react-redux";

const NAV_ITEMS = [
  { icon: "🏡", label: "Home", href: "/home" },
  { icon: "🌈", label: "Mood", href: "/moodtracker" },
  { icon: "📓", label: "Journal", href: "/journal" },
  { icon: "🌿", label: "Habits", href: "/habits" },
  { icon: "🎯", label: "Goals", href: "/goals" },
  { icon: "🧘", label: "Mindfulness", href: "/mindfulness" },
];

const Sidebar = ({ active, bgc, isOpen, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const name = user?.name ?? "Beautiful";

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            zIndex: 40,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "240px",
          background: bgc,
          backdropFilter: "blur(24px)",
          borderRight: "1.5px solid rgba(249,168,212,0.3)",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1.25rem",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : undefined,
          boxShadow: "4px 0 30px rgba(190,24,93,0.27)",
          transition: "transform 0.3s ease",
        }}
        className="sidebar-desktop"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>🌸</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.3rem",
              background: "linear-gradient(90deg, #be185d, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Blossom
          </span>
        </div>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.label === active;
            return (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 1rem",
                  borderRadius: "1rem",
                  textDecoration: "none",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.9rem",
                  color: isActive ? "#be185d" : "#9d6b87",
                  background: isActive
                    ? "linear-gradient(90deg, rgba(252,231,243,0.9), rgba(243,232,255,0.7))"
                    : "transparent",
                  border: isActive
                    ? "1.5px solid rgba(249,168,212,0.4)"
                    : "1.5px solid transparent",
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

        <div
          style={{
            marginTop: "auto",
            background:
              "linear-gradient(135deg, rgba(252,231,243,0.8), rgba(243,232,255,0.6))",
            border: "1.5px solid rgba(249,168,212,0.35)",
            borderRadius: "1.2rem",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #fce7f3, #f3e8ff)",
              border: "2px solid #f9a8d4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              flexShrink: 0,
            }}
          >
            🦋
          </div>
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#1a1a2e",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#c084fc" }}>
              Member ✨
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;