import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitLog,
  fetchHabits,
  selectFilter,
  selectHabitWithStats,
  selectTodayProgress,
  selectHabitsStatus,
} from "../services/HabitTracker/HabitTrackerThunk";

import {
  addHabitLocal,
  removeHabitLocal,
  updateHabitLocal,
  setFilter,
  toggleTodayLocal,
} from "../services/HabitTracker/HabitTrackerSlice";
import Sidebar from "../Hero/Sidebar";

const CATEGORIES = [
  { id: "self-care", label: "Self-care", icon: "🌸", color: "#ec4899" },
  { id: "health", label: "Health", icon: "💧", color: "#3b82f6" },
  { id: "fitness", label: "Fitness", icon: "🏃", color: "#22c55e" },
  { id: "mindfulness", label: "Mindfulness", icon: "🧘", color: "#a855f7" },
  { id: "learning", label: "Learning", icon: "📚", color: "#f59e0b" },
  { id: "social", label: "Social", icon: "💌", color: "#f43f5e" },
];

const EMOJI_OPTIONS = [
  "✨",
  "🌸",
  "💧",
  "📓",
  "🧘",
  "🏃",
  "💪",
  "🌿",
  "☀️",
  "🍵",
  "💊",
  "🎨",
  "🎵",
  "📚",
  "💌",
  "🥗",
  "😴",
  "🦷",
  "🧴",
  "🌙",
];

const COLOR_OPTIONS = [
  "#ec4899",
  "#a855f7",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#f43f5e",
  "#06b6d4",
  "#84cc16",
  "#fb923c",
  "#8b5cf6",
];

const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const todayStr = () => new Date().toISOString().split("T")[0];

const iconBtnStyle = {
  background: "rgba(255,255,255,0.8)",
  border: "1.5px solid rgba(249,168,212,0.3)",
  borderRadius: "0.6rem",
  width: "2rem",
  height: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "0.9rem",
  transition: "all 0.2s",
};
const dangerBtnStyle = {
  background: "rgba(254,242,242,0.9)",
  border: "1.5px solid #fca5a5",
  color: "#dc2626",
  borderRadius: "0.75rem",
  padding: "0.3rem 0.75rem",
  fontSize: "0.75rem",
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};
const ghostBtnStyle = {
  background: "transparent",
  border: "1.5px solid rgba(0,0,0,0.1)",
  borderRadius: "0.6rem",
  width: "1.8rem",
  height: "1.8rem",
  cursor: "pointer",
  fontSize: "0.8rem",
  color: "#9ca3af",
};
const labelStyle = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "#be185d",
  marginBottom: "0.45rem",
};
const inputStyle = (hasVal) => ({
  width: "100%",
  padding: "0.7rem 1rem",
  borderRadius: "0.9rem",
  border: `2px solid ${hasVal ? "rgba(236,72,153,0.4)" : "rgba(249,168,212,0.35)"}`,
  background: "rgba(255,255,255,0.75)",
  color: "#1a1a2e",
  fontSize: "0.9rem",
  fontFamily: "Georgia, serif",
  outline: "none",
  marginBottom: "1.1rem",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
});

function ConfettiPop({ x, y, onDone }) {
  const pieces = Array.from({ length: 10 }, (_, i) => ({
    angle: (i / 10) * 360,
    color: ["#ec4899", "#a855f7", "#fcd34d", "#34d399", "#60a5fa"][i % 5],
    size: Math.random() * 6 + 5,
  }));
  useEffect(() => {
    const t = setTimeout(onDone, 700);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            animation: "confettiBurst 0.65s ease-out forwards",
            animationDelay: `${i * 20}ms`,
            transform: `rotate(${p.angle}deg)`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

function HabitRow({ habit, onToggle, onDelete, onEdit }) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setConfirmDelete(false);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        background: habit.completedToday
          ? `linear-gradient(135deg, ${habit.color}12, ${habit.color}06)`
          : "rgba(255,255,255,0.65)",
        border: `2px solid ${habit.completedToday ? habit.color + "40" : "rgba(249,168,212,0.2)"}`,
        borderRadius: "1.25rem",
        padding: "1rem 1.25rem",
        backdropFilter: "blur(10px)",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        boxShadow: hovered
          ? `0 8px 24px ${habit.color}20`
          : "0 2px 8px rgba(190,24,93,0.04)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {habit.completedToday && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent 40%, ${habit.color}12 50%, transparent 60%)`,
            animation: "shimmer 3s infinite",
            pointerEvents: "none",
          }}
        />
      )}

      <button
        onClick={() => onToggle(habit.id)}
        style={{
          flexShrink: 0,
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: "0.7rem",
          border: `2.5px solid ${habit.completedToday ? habit.color : "rgba(209,213,219,0.8)"}`,
          background: habit.completedToday
            ? `linear-gradient(135deg, ${habit.color}, ${habit.color}cc)`
            : "rgba(255,255,255,0.8)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          transform: habit.completedToday ? "scale(1.05)" : "scale(1)",
          boxShadow: habit.completedToday
            ? `0 4px 12px ${habit.color}50`
            : "none",
        }}
      >
        {habit.completedToday && (
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <path
              d="M1 5L5 9L12 1"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 20,
                strokeDashoffset: 0,
                animation: "checkDraw 0.3s ease forwards",
              }}
            />
          </svg>
        )}
      </button>

      <div
        style={{
          width: "2.4rem",
          height: "2.4rem",
          borderRadius: "0.75rem",
          flexShrink: 0,
          background: `${habit.color}18`,
          border: `1.5px solid ${habit.color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
        }}
      >
        {habit.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#374151",
              letterSpacing: "-0.01em",
            }}
          >
            {habit.name}
          </span>
          {habit.streak > 0 && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                background: `${habit.color}20`,
                color: habit.color,
                border: `1px solid ${habit.color}40`,
                borderRadius: "2rem",
                padding: "0.1rem 0.55rem",
              }}
            >
              🔥 {habit.streak}d
            </span>
          )}
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 600,
              background: "rgba(0,0,0,0.04)",
              color: "#9ca3af",
              borderRadius: "2rem",
              padding: "0.1rem 0.5rem",
              textTransform: "capitalize",
            }}
          >
            {habit.category}
          </span>
        </div>

        {habit.note && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "#9d6b87",
              margin: "0.2rem 0 0",
              lineHeight: 1.4,
            }}
          >
            {habit.note}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            marginTop: "0.5rem",
            alignItems: "center",
          }}
        >
          {habit.last7.map((done, i) => (
            <div
              key={i}
              title={done ? "Completed" : "Missed"}
              style={{
                width: "1.4rem",
                height: "1.4rem",
                borderRadius: "0.35rem",
                background: done ? habit.color : "rgba(0,0,0,0.06)",
                opacity: done ? 1 : 0.5,
                transition: "transform 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.55rem",
                color: done ? "white" : "#9ca3af",
                fontWeight: 700,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.2)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {DAYS_SHORT[(new Date().getDay() - 6 + i + 7) % 7]}
            </div>
          ))}
          <span
            style={{
              fontSize: "0.68rem",
              color: "#9d6b87",
              marginLeft: "0.25rem",
            }}
          >
            {habit.totalCompleted} total
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {confirmDelete ? (
          <>
            <button onClick={() => onDelete(habit.id)} style={dangerBtnStyle}>
              Delete?
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={ghostBtnStyle}
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(habit)}
              style={{ ...iconBtnStyle, opacity: hovered ? 1 : 0 }}
            >
              ✏️
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ ...iconBtnStyle, opacity: hovered ? 1 : 0 }}
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HabitModal({ editHabit, onClose, onSave }) {
  const [form, setForm] = useState(
    editHabit
      ? {
          name: editHabit.name,
          icon: editHabit.icon,
          color: editHabit.color,
          category: editHabit.category,
          note: editHabit.note ?? "",
          frequency: "daily",
        }
      : {
          name: "",
          icon: "✨",
          color: "#ec4899",
          category: "self-care",
          frequency: "daily",
          note: "",
        },
  );
  const inputRef = useRef(null);
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim().length > 0;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(30,10,40,0.35)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        style={{
          background: "linear-gradient(160deg, #fff0f6, #fdf2f8, #f5f3ff)",
          border: "1.5px solid rgba(249,168,212,0.4)",
          borderRadius: "2rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 24px 60px rgba(190,24,93,0.18)",
          animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255,255,255,0.8)",
            border: "1.5px solid #fce7f3",
            borderRadius: "0.6rem",
            width: "2rem",
            height: "2rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            color: "#9d6b87",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        <h2
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 900,
            fontSize: "1.4rem",
            background: "linear-gradient(90deg, #be185d, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          {editHabit ? "Edit Habit ✏️" : "New Habit ✨"}
        </h2>

        <label style={labelStyle}>Habit Name</label>
        <input
          ref={inputRef}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Morning walk 🌅"
          style={inputStyle(form.name.length > 0)}
          maxLength={40}
        />

        <label style={labelStyle}>Pick an Emoji</label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "1.1rem",
          }}
        >
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => set("icon", e)}
              style={{
                fontSize: "1.3rem",
                background:
                  form.icon === e
                    ? "linear-gradient(135deg, #fce7f3, #f3e8ff)"
                    : "rgba(255,255,255,0.7)",
                border:
                  form.icon === e
                    ? "2px solid #ec4899"
                    : "2px solid transparent",
                borderRadius: "0.6rem",
                width: "2.5rem",
                height: "2.5rem",
                cursor: "pointer",
                transition: "all 0.15s",
                transform: form.icon === e ? "scale(1.2)" : "scale(1)",
              }}
            >
              {e}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Color</label>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1.1rem",
            flexWrap: "wrap",
          }}
        >
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => set("color", c)}
              style={{
                width: "1.8rem",
                height: "1.8rem",
                borderRadius: "50%",
                background: c,
                border:
                  form.color === c
                    ? "3px solid white"
                    : "3px solid transparent",
                boxShadow:
                  form.color === c
                    ? `0 0 0 2px ${c}, 0 4px 10px ${c}60`
                    : "none",
                cursor: "pointer",
                transition: "all 0.15s",
                transform: form.color === c ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <label style={labelStyle}>Category</label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            marginBottom: "1.1rem",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => set("category", cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                background:
                  form.category === cat.id
                    ? `${cat.color}20`
                    : "rgba(255,255,255,0.7)",
                border: `1.5px solid ${form.category === cat.id ? cat.color + "60" : "rgba(249,168,212,0.3)"}`,
                color: form.category === cat.id ? cat.color : "#9d6b87",
                borderRadius: "2rem",
                padding: "0.35rem 0.8rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <label style={labelStyle}>Note (optional)</label>
        <input
          value={form.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="Any reminder or motivation..."
          style={{ ...inputStyle(false), marginBottom: "1.5rem" }}
          maxLength={80}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: `${form.color}12`,
            border: `1.5px solid ${form.color}30`,
            borderRadius: "1rem",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "2.2rem",
              height: "2.2rem",
              borderRadius: "0.6rem",
              background: `${form.color}25`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            {form.icon}
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a2e" }}
            >
              {form.name || "Your habit name"}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                color: form.color,
                fontWeight: 600,
              }}
            >
              {form.category} · daily
            </div>
          </div>
        </div>

        <button
          onClick={() => valid && onSave(form)}
          disabled={!valid}
          style={{
            width: "100%",
            padding: "0.9rem",
            background: valid
              ? "linear-gradient(90deg, #be185d, #ec4899, #a855f7)"
              : "rgba(0,0,0,0.08)",
            color: valid ? "#fff" : "#ccc",
            border: "none",
            borderRadius: "1rem",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: valid ? "pointer" : "default",
            letterSpacing: "0.04em",
            fontFamily: "Georgia, serif",
            boxShadow: valid ? "0 6px 20px rgba(190,24,93,0.3)" : "none",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            if (valid) e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {editHabit ? "Save Changes ✨" : "Add Habit 🌸"}
        </button>
      </div>
    </div>
  );
}

export default function HabitTracker() {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabitWithStats);
  const progress = useSelector(selectTodayProgress);
  const filter = useSelector(selectFilter);
  const status = useSelector(selectHabitsStatus);

  const [showModal, setShowModal] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [confetti, setConfetti] = useState(null);
  const [celebrateDone, setCelebrateDone] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  useEffect(() => {
    if (progress.total > 0 && progress.done === progress.total) {
      setCelebrateDone(true);
    } else {
      setCelebrateDone(false);
    }
  }, [progress.done, progress.total]);

  const handleToggle = (id, e) => {
    const rect = (e?.currentTarget ?? document.body).getBoundingClientRect();
    const habit = habits.find((h) => h.id === id);

    dispatch(toggleTodayLocal(id));
    dispatch(
      toggleHabitLog({
        habitId: id,
        date: todayStr(),
        status: !habit?.completedToday,
      }),
    );

    if (!habit?.completedToday) {
      setConfetti({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  const handleDelete = (id) => {
    dispatch(removeHabitLocal(id));
    dispatch(deleteHabit(id));
  };

  const handleSave = (form) => {
    if (editHabit) {
      dispatch(updateHabitLocal({ id: editHabit.id, updates: form }));
      dispatch(updateHabit({ id: editHabit.id, updates: form }));
    } else {
      dispatch(addHabitLocal(form));
      dispatch(createHabit(form));
    }
    setShowModal(false);
    setEditHabit(null);
  };

  const openEdit = (habit) => {
    setEditHabit(habit);
    setShowModal(true);
  };

  const filtered = habits.filter((h) => {
    if (filter === "all") return true;
    if (filter === "done") return h.completedToday;
    if (filter === "pending") return !h.completedToday;
    return h.category === filter;
  });

  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (progress.pct / 100) * circumference;

  return (
    <div
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #fff0f6 0%, #fdf2f8 35%, #f5f3ff 70%, #faf5ff 100%)",
        padding: "2.5rem 2rem 5rem",
        position: "relative",
      }}
    >
        <Sidebar active="Habits" bgc="#FFF0F6a0" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {confetti && (
        <ConfettiPop
          x={confetti.x}
          y={confetti.y}
          onDone={() => setConfetti(null)}
        />
      )}

      {showModal && (
        <HabitModal
          editHabit={editHabit}
          onClose={() => {
            setShowModal(false);
            setEditHabit(null);
          }}
          onSave={handleSave}
        />
      )}

      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.15rem",
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>🌿</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#22c55e",
                }}
              >
                HABIT TRACKER
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              <span style={{ color: "#1a1a2e" }}>Build Your </span>
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #22c55e, #ec4899, #a855f7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Blossom ✨
              </span>
            </h1>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9d6b87",
                marginTop: "0.3rem",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={() => {
              setEditHabit(null);
              setShowModal(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "linear-gradient(90deg, #be185d, #ec4899)",
              color: "#fff",
              border: "none",
              borderRadius: "1rem",
              padding: "0.75rem 1.4rem",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(190,24,93,0.3)",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.02em",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 10px 28px rgba(190,24,93,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(190,24,93,0.3)";
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>＋</span> New Habit
          </button>
        </div>

        {status === "loading" && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#ec4899",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            🌸 Loading your habits...
          </div>
        )}

        {status !== "loading" && (
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(252,231,243,0.5))",
              border: "1.5px solid rgba(249,168,212,0.35)",
              borderRadius: "1.5rem",
              padding: "1.5rem 1.75rem",
              marginBottom: "1.5rem",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
              boxShadow: "0 4px 20px rgba(190,24,93,0.07)",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 70 70">
                <circle
                  cx="35"
                  cy="35"
                  r="28"
                  fill="none"
                  stroke="rgba(249,168,212,0.3)"
                  strokeWidth="6"
                />
                <circle
                  cx="35"
                  cy="35"
                  r="28"
                  fill="none"
                  stroke="url(#progressGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 35 35)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
                <defs>
                  <linearGradient
                    id="progressGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 900,
                    color: "#be185d",
                    lineHeight: 1,
                  }}
                >
                  {progress.pct}%
                </span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "#1a1a2e",
                  marginBottom: "0.2rem",
                }}
              >
                {progress.done === progress.total && progress.total > 0
                  ? "All done! You're amazing! 🎉"
                  : `${progress.done} of ${progress.total} habits done today`}
              </div>
              <p style={{ fontSize: "0.82rem", color: "#9d6b87", margin: 0 }}>
                {progress.done === 0
                  ? "Let's start ticking those boxes! 🌸"
                  : progress.pct < 50
                    ? "You're on your way — keep going! 💪"
                    : progress.pct < 100
                      ? "More than halfway there, gorgeous! ✨"
                      : "Every single habit completed. You blossomed today! 🌷"}
              </p>
              <div
                style={{
                  height: "0.5rem",
                  borderRadius: "1rem",
                  background: "rgba(0,0,0,0.07)",
                  marginTop: "0.75rem",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "1rem",
                    background: "linear-gradient(90deg, #ec4899, #a855f7)",
                    width: `${progress.pct}%`,
                    transition: "width 0.8s ease",
                    boxShadow: "0 2px 8px rgba(236,72,153,0.4)",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
                minWidth: "130px",
              }}
            >
              {CATEGORIES.slice(0, 4).map((cat) => {
                const total = habits.filter(
                  (h) => h.category === cat.id,
                ).length;
                const done = habits.filter(
                  (h) => h.category === cat.id && h.completedToday,
                ).length;
                if (!total) return null;
                return (
                  <div
                    key={cat.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem" }}>{cat.icon}</span>
                    <div
                      style={{
                        flex: 1,
                        height: "0.3rem",
                        borderRadius: "1rem",
                        background: "rgba(0,0,0,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: cat.color,
                          width: `${(done / total) * 100}%`,
                          borderRadius: "1rem",
                          transition: "width 0.6s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        color: "#9ca3af",
                        fontWeight: 600,
                        minWidth: "28px",
                      }}
                    >
                      {done}/{total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1.25rem",
          }}
        >
          {[
            { id: "all", label: "All", icon: "✦" },
            { id: "done", label: "Done", icon: "✅" },
            { id: "pending", label: "Pending", icon: "⏳" },
            ...CATEGORIES.map((c) => ({
              id: c.id,
              label: c.label,
              icon: c.icon,
            })),
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => dispatch(setFilter(f.id))}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                background:
                  filter === f.id
                    ? "linear-gradient(90deg, rgba(252,231,243,0.95), rgba(243,232,255,0.85))"
                    : "rgba(255,255,255,0.65)",
                border:
                  filter === f.id
                    ? "1.5px solid rgba(236,72,153,0.5)"
                    : "1.5px solid rgba(249,168,212,0.2)",
                color: filter === f.id ? "#be185d" : "#9d6b87",
                borderRadius: "2rem",
                padding: "0.35rem 0.85rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
                boxShadow:
                  filter === f.id ? "0 2px 10px rgba(190,24,93,0.12)" : "none",
              }}
            >
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem 1rem",
                background: "rgba(255,255,255,0.5)",
                borderRadius: "1.5rem",
                border: "2px dashed rgba(249,168,212,0.4)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                🌱
              </div>
              <p
                style={{
                  color: "#9d6b87",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                {filter === "done"
                  ? "No habits completed yet today. You got this! 💪"
                  : filter === "pending"
                    ? "All habits done! You're incredible! 🎉"
                    : "No habits here yet. Add your first one! 🌸"}
              </p>
              {filter === "all" && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    marginTop: "1rem",
                    background: "linear-gradient(90deg, #be185d, #ec4899)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "1rem",
                    padding: "0.6rem 1.4rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Add First Habit ✨
                </button>
              )}
            </div>
          ) : (
            filtered.map((habit, i) => (
              <div
                key={habit.id}
                style={{
                  animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
                  opacity: 0,
                }}
              >
                <HabitRow
                  habit={habit}
                  onToggle={(id) => {
                    const el = document.getElementById(`hab-${id}`);
                    handleToggle(id, el ? { currentTarget: el } : null);
                  }}
                  onDelete={handleDelete}
                  onEdit={openEdit}
                />
              </div>
            ))
          )}
        </div>

        {habits.length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              background: "rgba(255,255,255,0.5)",
              border: "1.5px solid rgba(249,168,212,0.25)",
              borderRadius: "1.25rem",
              padding: "1.1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>💡</span>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9d6b87",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: "#be185d" }}>Tip:</strong> Consistency
              beats perfection. Even one small habit done daily compounds into
              something beautiful over time. 🌷
            </p>
          </div>
        )}
      </div>

      {celebrateDone && progress.total > 0 && (
        <div
          onClick={() => setCelebrateDone(false)}
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
            cursor: "pointer",
            background: "linear-gradient(90deg, #be185d, #ec4899, #a855f7)",
            color: "#fff",
            borderRadius: "2rem",
            padding: "0.9rem 2rem",
            boxShadow: "0 8px 30px rgba(190,24,93,0.4)",
            fontWeight: 800,
            fontSize: "0.95rem",
            animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            whiteSpace: "nowrap",
          }}
        >
          🎉 All habits done today! You're blooming! 🌷
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) translateX(-50%); }
          to   { opacity: 1; transform: translateY(0)    translateX(-50%); }
        }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%);  }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 20; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes confettiBurst {
          0%   { transform: rotate(var(--a,0deg)) translateY(0)    scale(1); opacity: 1; }
          100% { transform: rotate(var(--a,0deg)) translateY(-50px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
