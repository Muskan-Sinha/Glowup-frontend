import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllEntries,
  fetchByMonth,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
} from "../services/Journal/JournalThunk";
import {
  setView,
  clearSelected,
  clearSearch,
  setSearchQuery,
  clearError,
} from "../services/Journal/JournalSlice";
import img from "../assets/bg4.png";
import Sidebar from "../Hero/Sidebar";

const MOODS = [
  { key: "happy",   emoji: "🤩", label: "Happy",   color: "#FFD700" },
  { key: "good",    emoji: "😊", label: "Good",    color: "#7EC8A4" },
  { key: "meh",     emoji: "😐", label: "Meh",     color: "#A8C8E8" },
  { key: "sad",     emoji: "😔", label: "Sad",     color: "#F4A4A4" },
  { key: "awful",   emoji: "😭", label: "Awful",   color: "#C49BD3" },
  { key: "angry",   emoji: "😡", label: "Angry",   color: "#FF7043" },
  { key: "anxious", emoji: "😰", label: "Anxious", color: "#FFB74D" },
  { key: "loved",   emoji: "🥰", label: "Loved",   color: "#F48FB1" },
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const getMood  = (key) => MOODS.find((m) => m.key === key);
const dayKey   = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });
const formatShort = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const card =
  "rounded-3xl border border-[#f0c8d0] bg-white transition-all duration-200";
const pinkGrad = {
  background: "linear-gradient(135deg,#ee6381,#b64e5f)",
  boxShadow: "0 6px 20px rgba(182,78,95,0.3)",
};
const playfair = { fontFamily: "'Playfair Display', serif" };

const WriteView = ({ editing, onBack }) => {
  const dispatch = useDispatch();
  const [title,   setTitle]   = useState(editing?.title   || "");
  const [content, setContent] = useState(editing?.content || "");
  const [mood,    setMood]    = useState(editing?.mood    || "");
  const [tags,    setTags]    = useState(
    editing?.tags?.length ? editing.tags.join(", ") : ""
  );
  const [date, setDate] = useState(
    editing?.date
      ? new Date(editing.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );

  const handleSave = () => {
    if (!content.trim()) return;
    const payload = {
      title:   title.trim() || undefined,
      content: content.trim(),
      mood:    mood || undefined,
      tags:    tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      date,
    };
    if (editing) {
      dispatch(updateEntry({ id: editing._id, updates: payload }));
    } else {
      dispatch(createEntry(payload));
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[3px] uppercase text-[#ee6381]">
            {editing ? "editing entry" : "new entry"}
          </p>
          <h2 className="text-3xl font-extrabold text-[#b64e5f]" style={playfair}>
            {editing ? "✏️ Edit Entry" : "✍️ Dear Diary..."}
          </h2>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-2xl text-sm font-semibold text-[#b64e5f] bg-[#fce8ef] hover:brightness-95 transition-all"
        >
          ← back
        </button>
      </div>

      {/* Form card */}
      <div className={`${card} p-6 shadow-[0_4px_24px_rgba(182,78,95,0.1)]`}>
        {/* Date + Mood */}
        <div className="flex gap-4 mb-5 flex-wrap">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm text-[#7a3040] border border-[#f0c8d0] focus:border-[#ee6381] outline-none bg-[#fdf0f3] transition-colors"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
              Mood
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMood(mood === m.key ? "" : m.key)}
                  title={m.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: mood === m.key ? m.color + "33" : "#fdf0f3",
                    outline:    mood === m.key ? `2.5px solid ${m.color}` : "none",
                  }}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Title <span className="normal-case text-[#d0b0b8]">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this entry a name..."
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[#7a3040] border border-[#f0c8d0] focus:border-[#ee6381] outline-none bg-[#fdf0f3] transition-colors"
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Your Thoughts <span className="text-[#ee6381]">*</span>
          </label>
          <textarea
            rows={11}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Today I felt..."
            className="w-full rounded-2xl px-4 py-3 text-sm text-[#7a3040] border border-[#f0c8d0] focus:border-[#ee6381] outline-none bg-[#fdf0f3] transition-colors resize-none leading-relaxed"
          />
          <p className="text-right text-[10px] text-[#d0b0b8] mt-1">
            {content.length} chars
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-[10px] tracking-[2px] uppercase text-[#c08090] font-semibold mb-1.5">
            Tags <span className="normal-case text-[#d0b0b8]">(comma separated)</span>
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="gratitude, work, family..."
            className="w-full rounded-xl px-4 py-2.5 text-sm text-[#7a3040] border border-[#f0c8d0] focus:border-[#ee6381] outline-none bg-[#fdf0f3] transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold text-[#b64e5f] bg-[#fce8ef] hover:brightness-95 transition-all"
          >
            discard
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="flex-[2] py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={pinkGrad}
          >
            {editing ? "save changes 🌸" : "save entry 🌸"}
          </button>
        </div>
      </div>
    </div>
  );
};


const ReadView = ({ entry, onEdit }) => {
  const dispatch  = useDispatch();
  const moodData  = getMood(entry.mood);

  const handleDelete = () => {
    dispatch(deleteEntry(entry._id));
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { dispatch(clearSelected()); dispatch(setView("list")); }}
          className="px-4 py-2 rounded-2xl text-sm font-semibold text-[#b64e5f] bg-[#fce8ef] hover:brightness-95 transition-all"
        >
          ← back
        </button>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-2xl text-sm font-semibold text-[#b64e5f] bg-[#fce8ef] hover:brightness-95 transition-all"
          >
            ✏ edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-2xl text-sm font-semibold text-[#e06080] bg-[#fce8ef] hover:brightness-95 transition-all"
          >
            🗑 delete
          </button>
        </div>
      </div>

      <div className={`${card} p-7 shadow-[0_4px_24px_rgba(182,78,95,0.1)]`}>
        {/* Date + mood */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span className="text-xs text-[#c08090] font-medium">
            📅 {formatDate(entry.date || entry.createdAt)}
          </span>
          {moodData && (
            <span
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: moodData.color + "22", color: moodData.color }}
            >
              {moodData.emoji} {moodData.label}
            </span>
          )}
        </div>

        {entry.title && (
          <h1 className="text-3xl font-extrabold text-[#b64e5f] mb-4 leading-snug" style={playfair}>
            {entry.title}
          </h1>
        )}

        <div className="w-16 h-0.5 bg-gradient-to-r from-[#f0c8d0] to-transparent mb-5 rounded-full" />

        <p className="text-sm text-[#7a3040] leading-[1.9] whitespace-pre-wrap">
          {entry.content}
        </p>

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#fce4ea]">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{ background: "#fce8ef", color: "#b64e5f" }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EntryCard = ({ entry, onClick }) => {
  const moodData = getMood(entry.mood);
  const preview  = entry.content?.slice(0, 130) + (entry.content?.length > 130 ? "…" : "");

  return (
    <button
      onClick={onClick}
      className={`${card} p-5 w-full text-left hover:-translate-y-1 shadow-[0_4px_16px_rgba(182,78,95,0.07)] hover:shadow-[0_8px_28px_rgba(182,78,95,0.14)]`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {entry.title ? (
            <h3 className="text-base font-bold text-[#7a3040] truncate" style={playfair}>
              {entry.title}
            </h3>
          ) : (
            <h3 className="text-base font-bold text-[#c08090] italic truncate">
              untitled entry
            </h3>
          )}
          <p className="text-[10px] text-[#c08090] mt-0.5">
            {formatShort(entry.date || entry.createdAt)}
          </p>
        </div>
        {moodData && (
          <span className="text-2xl flex-shrink-0" title={moodData.label}>
            {moodData.emoji}
          </span>
        )}
      </div>

      <p className="text-xs text-[#a08090] leading-relaxed">{preview}</p>

      {entry.tags?.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {entry.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
              style={{ background: "#fce8ef", color: "#b64e5f" }}
            >
              #{tag}
            </span>
          ))}
          {entry.tags.length > 3 && (
            <span className="text-[9px] text-[#c08090] self-center">
              +{entry.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
};

const CalendarView = ({ onEntryClick }) => {
  const dispatch = useDispatch();
  const { monthEntries } = useSelector((s) => s.journal);
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(new Date());

  const year  = displayDate.getFullYear();
  const month = displayDate.getMonth();

  useEffect(() => {
    dispatch(fetchByMonth({ year, month: month + 1 }));
  }, [year, month, dispatch]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  const entryMap = {};
  monthEntries.forEach((e) => {
    const k = new Date(e.date || e.createdAt).toISOString().split("T")[0];
    entryMap[k] = e;
  });

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      <div>
        <p className="text-[10px] font-bold tracking-[3px] uppercase text-[#ee6381]">
          your journey
        </p>
        <h2 className="text-3xl font-extrabold text-[#b64e5f]" style={playfair}>
          📅 Memory Calendar
        </h2>
      </div>

      <div className={`${card} p-6 shadow-[0_4px_24px_rgba(182,78,95,0.1)]`}>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setDisplayDate(new Date(year, month - 1, 1))}
            className="text-3xl text-[#b64e5f] hover:text-[#ee6381] transition-colors px-2"
          >
            ←
          </button>
          <h3 className="text-xl font-extrabold text-[#b64e5f]" style={playfair}>
            {MONTH_NAMES[month]} {year}
          </h3>
          <button
            onClick={() => setDisplayDate(new Date(year, month + 1, 1))}
            className="text-3xl text-[#b64e5f] hover:text-[#ee6381] transition-colors px-2"
          >
            →
          </button>
        </div>

        
        <div className="grid grid-cols-7 mb-3">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="text-center text-[10px] font-bold uppercase text-[#c08090]">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            const k        = dayKey(year, month, day);
            const entry    = entryMap[k];
            const isToday  =
              today.getFullYear() === year &&
              today.getMonth()    === month &&
              today.getDate()     === day;
            const moodData = entry ? getMood(entry.mood) : null;

            return (
              <button
                key={k}
                onClick={() => entry && onEntryClick(entry)}
                disabled={!entry}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105"
                style={{
                  background: entry
                    ? moodData ? moodData.color + "33" : "#fce8ef"
                    : isToday  ? "rgba(182,78,95,0.08)"  : "transparent",
                  border:  isToday && !entry ? "2px solid #ee638188" : "1px solid transparent",
                  cursor: entry ? "pointer" : "default",
                }}
              >
                <span
                  className="text-xs font-semibold leading-none mb-0.5"
                  style={{ color: entry ? "#b64e5f" : isToday ? "#ee6381" : "#c08090" }}
                >
                  {day}
                </span>
                {moodData && <span className="text-base leading-none">{moodData.emoji}</span>}
                {entry && !moodData && (
                  <span className="text-[8px] text-[#b64e5f] leading-none">✦</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-[#c08090] italic">
        {monthEntries.length} {monthEntries.length === 1 ? "entry" : "entries"} this month
      </p>
    </div>
  );
};

const ListView = ({ onEntryClick, onWrite }) => {
  const dispatch = useDispatch();
  const { items, status, isSearching, searchResults, total } =
    useSelector((s) => s.journal);

  const [localSearch, setLocalSearch] = useState("");

  const doSearch = useCallback(
    (q) => {
      if (!q.trim()) { dispatch(clearSearch()); return; }
      dispatch(setSearchQuery(q));
      dispatch(searchEntries(q));
    },
    [dispatch]
  );

  useEffect(() => {
    const t = setTimeout(() => doSearch(localSearch), 400);
    return () => clearTimeout(t);
  }, [localSearch, doSearch]);

  const displayList = localSearch.trim() ? searchResults : items;

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-bold tracking-[3px] uppercase text-[#ee6381]">
            your memories
          </p>
          <h2 className="text-3xl font-extrabold text-[#b64e5f]" style={playfair}>
            📖 My Journal
          </h2>
          <p className="text-xs text-[#c08090] mt-0.5 italic">
            {total} {total === 1 ? "entry" : "entries"} written
          </p>
        </div>
        <button
          onClick={onWrite}
          className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 hover:brightness-110"
          style={pinkGrad}
        >
          ✍️ new entry
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c08090] pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="search entries, tags..."
          className="w-full rounded-2xl pl-10 pr-10 py-3 text-sm text-[#7a3040] border border-[#f0c8d0] focus:border-[#ee6381] outline-none bg-white transition-colors"
        />
        {localSearch && (
          <button
            onClick={() => { setLocalSearch(""); dispatch(clearSearch()); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#c08090] hover:text-[#b64e5f] transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {(status === "loading" || isSearching) && (
        <p className="text-center text-[#b64e5f] text-sm italic animate-pulse">
          {isSearching ? "searching..." : "loading entries..."}
        </p>
      )}

      {displayList.length === 0 && status !== "loading" && !isSearching && (
        <div className="text-center py-16 text-[#c08090]">
          <div className="text-6xl mb-4">🌷</div>
          <p className="text-sm italic">
            {localSearch
              ? `No entries found for "${localSearch}"`
              : "No entries yet — write your first one!"}
          </p>
        </div>
      )}

      {displayList.length > 0 && (
        <div className="flex flex-col gap-3">
          {displayList.map((entry) => (
            <EntryCard
              key={entry._id}
              entry={entry}
              onClick={() => onEntryClick(entry)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Journal = () => {
  const dispatch = useDispatch();
  const { activeView, selected, error } = useSelector((s) => s.journal);
  const [editingEntry, setEditingEntry] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchAllEntries());
  }, [dispatch]);

  const handleEntryClick = (entry) => {
    
    dispatch({ type: "journal/fetchOne/fulfilled", payload: entry });
    dispatch(setView("read"));
    setEditingEntry(null);
  };

  const handleWrite = () => {
    setEditingEntry(null);
    dispatch(setView("write"));
  };

  const handleEdit = () => {
    setEditingEntry(selected);
    dispatch(setView("write"));
  };

  const handleBackFromWrite = () => {
    if (editingEntry) {
      setEditingEntry(null);
      dispatch(setView("read"));
    } else {
      dispatch(setView("list"));
    }
  };

  const NAV_TABS = [
    { key: "list",     label: "📖 Entries"  },
    { key: "calendar", label: "📅 Calendar" },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed overflow-auto"
      style={{ backgroundImage: `url(${img})` }}
    >
      <Sidebar
        active="Journal"
        bgc="#FFF0F6eb"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-h-screen py-10">
        <div className="max-w-2xl mx-auto px-5">

          {activeView !== "write" && (
            <div className="flex justify-center gap-2 mb-8">
              {NAV_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => dispatch(setView(tab.key))}
                  className="px-5 py-2 rounded-full text-xs font-semibold transition-all border"
                  style={
                    activeView === tab.key || (activeView === "read" && tab.key === "list")
                      ? {
                          background: "#b64e5f",
                          borderColor: "#b64e5f",
                          color: "#fff",
                          boxShadow: "0 3px 12px rgba(182,78,95,0.3)",
                        }
                      : {
                          background: "rgba(255,255,255,0.85)",
                          borderColor: "#f0c8d0",
                          color: "#c08090",
                        }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-2xl text-sm text-[#b64e5f] border border-[#f0c8d0] bg-white flex justify-between items-center shadow-sm">
              <span>{error}</span>
              <button
                onClick={() => dispatch(clearError())}
                className="text-xl text-[#b64e5f] font-bold leading-none ml-4"
              >
                ×
              </button>
            </div>
          )}

          {activeView === "list" && (
            <ListView onEntryClick={handleEntryClick} onWrite={handleWrite} />
          )}

          {activeView === "write" && (
            <WriteView editing={editingEntry} onBack={handleBackFromWrite} />
          )}

          {activeView === "read" && selected && (
            <ReadView entry={selected} onEdit={handleEdit} />
          )}

          {activeView === "read" && !selected && (
            <ListView onEntryClick={handleEntryClick} onWrite={handleWrite} />
          )}

          {activeView === "calendar" && (
            <CalendarView onEntryClick={handleEntryClick} />
          )}

          <p className="text-center text-white/40 text-xs mt-14">
            Made with 🌸 by Muskan
          </p>
        </div>
      </div>
    </div>
  );
};

export default Journal;
