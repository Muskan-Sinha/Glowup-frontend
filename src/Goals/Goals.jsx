import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updatelog,
} from "../services/Goal/GoalThunk";
import { setFilter, clearError } from "../services/Goal/GoalSlice";
import img from "../assets/bg4.png";
import Sidebar from "../Hero/Sidebar";

const CATEGORIES = [
  { key: "health", label: "Health", color: "#f48fb1", bg: "#fce4ec" },
  { key: "career", label: "Career", color: "#90caf9", bg: "#e3f2fd" },
  { key: "finance", label: "Finance", color: "#a5d6a7", bg: "#e8f5e9" },
  { key: "personal", label: "Personal", color: "#ce93d8", bg: "#f3e5f5" },
  { key: "other", label: "Other", color: "#ffcc80", bg: "#fff3e0" },
];

const STATUS_META = {
  in_progress: {
    label: "In Progress",
    dot: "#c8b4ff",
    pill: "#f3e8ff",
    text: "#7c4daa",
  },
  completed: {
    label: "Completed",
    dot: "#7EC8A4",
    pill: "#e8f8ec",
    text: "#3a7d44",
  },
  abandoned: {
    label: "Abandoned",
    dot: "#d0d0d0",
    pill: "#f5f5f5",
    text: "#888",
  },
};

const FILTERS = ["all", "in_progress", "completed", "abandoned"];

const getCat = (key) => CATEGORIES.find((c) => c.key === key) || CATEGORIES[4];

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (d, status) => {
  if (!d || status !== "in_progress") return false;
  return new Date(d) < new Date();
};

const GoalModal = ({ onClose, onSave, initial }) => {
  const [form, setForm] = useState(
    initial || { name: "", desc: "", category: "health", targetDate: "" },
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.category || !form.targetDate) return;
    onSave(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(182,78,95,0.13)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl p-7 border border-[#f0c8d0]"
        style={{
          background: "#fff",
          boxShadow: "0 24px 60px rgba(182,78,95,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold tracking-[3px] uppercase text-[#ee6381] mb-1">
          {initial ? "edit goal" : "new goal"}
        </p>
        <h2
          className="text-2xl font-bold text-[#b64e5f] mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {initial ? "✏️ Update Goal" : "🌱 Plant a Goal"}
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Goal Name *
          </label>
          <input
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[#7a3040] outline-none border border-[#f0c8d0] focus:border-[#ee6381] transition-colors"
            style={{ background: "#fdf0f3" }}
            placeholder="e.g. Run a 5K race"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        {/* Desc */}
        <div className="mb-4">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[#7a3040] outline-none border border-[#f0c8d0] focus:border-[#ee6381] transition-colors resize-none"
            style={{ background: "#fdf0f3" }}
            placeholder="What does success look like?"
            value={form.desc}
            onChange={(e) => set("desc", e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Category *
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => set("category", c.key)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2"
                style={{
                  background: form.category === c.key ? c.color : c.bg,
                  color: form.category === c.key ? "#fff" : c.color,
                  borderColor:
                    form.category === c.key ? c.color : "transparent",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Date */}
        <div className="mb-6">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Target Date *
          </label>
          <input
            type="date"
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[#7a3040] outline-none border border-[#f0c8d0] focus:border-[#ee6381] transition-colors"
            style={{ background: "#fdf0f3" }}
            value={form.targetDate}
            onChange={(e) => set("targetDate", e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-[#b64e5f] transition-all hover:brightness-95"
            style={{ background: "#fce8ef" }}
          >
            cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-2.5 rounded-2xl text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#ee6381,#b64e5f)",
              boxShadow: "0 6px 20px rgba(182,78,95,0.35)",
            }}
          >
            {initial ? "save changes 🌸" : "plant it 🌸"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LogModal = ({ goal, onClose, onSave }) => {
  const [log, setLog] = useState(goal?.log || "");
  const [status, setStatus] = useState(goal?.status || "in_progress");

  const handleSave = () => {
    onSave({ log, status });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(182,78,95,0.13)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-7 border border-[#f0c8d0]"
        style={{
          background: "#fff",
          boxShadow: "0 24px 60px rgba(182,78,95,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold tracking-[3px] uppercase text-[#ee6381] mb-1">
          reflection
        </p>
        <h2
          className="text-2xl font-bold text-[#b64e5f] mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          📝 Add Log
        </h2>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-2">
            Update Status
          </label>
          <div className="flex gap-2">
            {["in_progress", "completed", "abandoned"].map((s) => {
              const meta = STATUS_META[s];
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all border-2"
                  style={{
                    background: status === s ? meta.dot : meta.pill,
                    color: status === s ? "#fff" : meta.text,
                    borderColor: status === s ? meta.dot : "transparent",
                  }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Log */}
        <div className="mb-6">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Your Reflection
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[#7a3040] outline-none border border-[#f0c8d0] focus:border-[#ee6381] transition-colors resize-none"
            style={{ background: "#fdf0f3" }}
            placeholder="How did it go? What did you learn?"
            value={log}
            onChange={(e) => setLog(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-[#b64e5f]"
            style={{ background: "#fce8ef" }}
          >
            cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] py-2.5 rounded-2xl text-sm font-semibold text-white active:scale-95"
            style={{
              background: "linear-gradient(135deg,#ee6381,#b64e5f)",
              boxShadow: "0 6px 20px rgba(182,78,95,0.3)",
            }}
          >
            save 🌸
          </button>
        </div>
      </div>
    </div>
  );
};

const GoalCard = ({ goal, onEdit, onLog, onDelete }) => {
  const cat = getCat(goal.category);
  const statusMeta = STATUS_META[goal.status] || STATUS_META.in_progress;
  const overdue = isOverdue(goal.targetDate, goal.status);

  return (
    <div
      className="rounded-3xl p-5 border transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "#fff",
        borderColor: "#f0c8d0",
        boxShadow: "0 4px 20px rgba(182,78,95,0.08)",
        opacity: goal.status === "abandoned" ? 0.65 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div
            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: statusMeta.dot }}
          />
          <div className="min-w-0">
            <p
              className="text-base font-bold text-[#7a3040] leading-snug"
              style={{
                fontFamily: "'Playfair Display', serif",
                textDecoration:
                  goal.status === "completed" ? "line-through" : "none",
              }}
            >
              {goal.name}
            </p>
            {goal.desc && (
              <p className="text-xs text-[#c08090] mt-0.5 leading-relaxed line-clamp-2">
                {goal.desc}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(goal._id)}
          className="text-[#e0b0b8] hover:text-[#b64e5f] transition-colors text-lg flex-shrink-0 leading-none"
          title="Delete"
        >
          ×
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span
          className="text-[10px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full uppercase"
          style={{ background: cat.bg, color: cat.color }}
        >
          {cat.label}
        </span>

        <span
          className="text-[10px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full"
          style={{ background: statusMeta.pill, color: statusMeta.text }}
        >
          {statusMeta.label}
        </span>

        {goal.targetDate && (
          <span
            className="text-[10px] font-medium ml-auto"
            style={{ color: overdue ? "#e06080" : "#c08090" }}
          >
            🗓 {formatDate(goal.targetDate)}
            {overdue && " · overdue"}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onLog(goal)}
          className="flex-1 py-2 rounded-2xl text-xs font-semibold transition-all hover:brightness-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg,#fce8ef,#f0d4e8)",
            color: "#b64e5f",
          }}
        >
          ✎ log
        </button>
        <button
          onClick={() => onEdit(goal)}
          className="flex-1 py-2 rounded-2xl text-xs font-semibold transition-all hover:brightness-105 active:scale-95"
          style={{ background: "#fdf0f3", color: "#b64e5f" }}
        >
          ✏ edit
        </button>
      </div>
    </div>
  );
};

const Goals = () => {
  const dispatch = useDispatch();
  const {
    items: goals,
    status,
    error,
    activeFilter,
  } = useSelector((state) => state.goals);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [logGoal, setLogGoal] = useState(null);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  // Stats
  const total = goals.length;
  const completed = goals.filter((g) => g.status === "completed").length;
  const inProgress = goals.filter((g) => g.status === "in_progress").length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const filtered =
    activeFilter === "all"
      ? goals
      : goals.filter((g) => g.status === activeFilter);

  // Handlers
  const handleCreate = (form) => {
    dispatch(createGoal(form));
  };

  const handleEdit = (form) => {
    dispatch(updateGoal({ id: editGoal._id, updates: form }));
    setEditGoal(null);
  };

  const handleLog = ({ log, status }) => {
    // updatelog handles status + log field
    dispatch(updatelog({ id: logGoal._id, updates: { status, log } }));
    setLogGoal(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteGoal(id));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative overflow-auto"
      style={{ backgroundImage: `url(${img})` }}
    >
        <Sidebar active="Goals" bgc="#FFF0F6a0" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen py-10">
        <div className="max-w-2xl mx-auto px-5">
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-[3px] uppercase text-[#b64e5f] mb-1">
              your dreams, your timeline
            </p>
            <h1
              className="text-5xl font-extrabold text-[#b64e5f] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Goal Garden 🌸
            </h1>
            <p className="text-sm italic text-[#c08090] mt-2">
              nurture your aspirations, one goal at a time
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { num: total, label: "Total", sub: "goals" },
              { num: inProgress, label: "In Progress", sub: "active" },
              { num: `${pct}%`, label: "Bloomed", sub: `${completed} done` },
            ].map(({ num, label, sub }) => (
              <div
                key={label}
                className="rounded-3xl py-5 text-center border border-white"
                style={{
                  background: "#f7e5e1",
                  boxShadow: "0 4px 20px rgba(182,78,95,0.1)",
                }}
              >
                <div
                  className="text-4xl font-extrabold text-[#b64e5f]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {num}
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-[#b64e5f] mt-0.5">
                  {label}
                </div>
                <div className="text-[10px] text-[#c08090] mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-4 rounded-3xl text-white font-semibold text-sm tracking-wider mb-8 transition-all hover:-translate-y-1 active:scale-98"
            style={{
              background: "linear-gradient(135deg,#ee6381,#b64e5f)",
              boxShadow: "0 8px 24px rgba(182,78,95,0.35)",
              letterSpacing: "1px",
            }}
          >
            ＋ plant a new goal
          </button>

          <div className="flex gap-2 mb-6 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => dispatch(setFilter(f))}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all border"
                style={
                  activeFilter === f
                    ? {
                        background: "#b64e5f",
                        borderColor: "#b64e5f",
                        color: "#fff",
                        boxShadow: "0 3px 12px rgba(182,78,95,0.3)",
                      }
                    : {
                        background: "#fff",
                        borderColor: "#f0c8d0",
                        color: "#c08090",
                      }
                }
              >
                {f === "all" ? "All" : STATUS_META[f]?.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl text-sm text-[#b64e5f] border border-[#f0c8d0] bg-[#fdf0f3] flex justify-between">
              <span>{error}</span>
              <button
                onClick={() => dispatch(clearError())}
                className="text-[#b64e5f] font-bold"
              >
                ×
              </button>
            </div>
          )}

          {status === "loading" && (
            <p className="text-center text-[#b64e5f] text-sm mb-4 italic">
              loading your goals...
            </p>
          )}

          {filtered.length === 0 && status !== "loading" ? (
            <div className="text-center py-16 text-[#c08090]">
              <div className="text-6xl mb-4">🌷</div>
              <p className="text-sm italic">
                {activeFilter === "all"
                  ? "No goals yet — plant your first one above!"
                  : `No ${STATUS_META[activeFilter]?.label.toLowerCase()} goals.`}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((goal) => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onEdit={(g) => setEditGoal(g)}
                  onLog={(g) => setLogGoal(g)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <p className="text-center text-white/50 text-xs mt-12">
            Made with 🌸 by Muskan
          </p>
        </div>
      </div>

      {showAdd && (
        <GoalModal onClose={() => setShowAdd(false)} onSave={handleCreate} />
      )}
      {editGoal && (
        <GoalModal
          onClose={() => setEditGoal(null)}
          onSave={handleEdit}
          initial={{
            name: editGoal.name,
            desc: editGoal.desc || "",
            category: editGoal.category,
            targetDate: editGoal.targetDate
              ? editGoal.targetDate.split("T")[0]
              : "",
          }}
        />
      )}
      {logGoal && (
        <LogModal
          goal={logGoal}
          onClose={() => setLogGoal(null)}
          onSave={handleLog}
        />
      )}
    </div>
  );
};

export default Goals;
