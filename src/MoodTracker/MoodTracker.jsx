import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addMood,
  fetchMoods,
  updateMood,
} from "../services/MoodTracker/MoodThunk";
import img from "../assets/bg4.png";
import Sidebar from "../Hero/Sidebar";

const MOODS = [
  { key: "happy", emoji: "🤩", label: "happy", color: "#FFD700" },
  { key: "good", emoji: "😊", label: "Good", color: "#7EC8A4" },
  { key: "meh", emoji: "😐", label: "Meh", color: "#A8C8E8" },
  { key: "sad", emoji: "😔", label: "sad", color: "#F4A4A4" },
  { key: "awful", emoji: "😭", label: "Awful", color: "#C49BD3" },
  { key: "angry", emoji: "😡", label: "Angry", color: "#FF7043" },
  { key: "anxious", emoji: "😰", label: "Anxious", color: "#FFB74D" },
  { key: "loved", emoji: "🥰", label: "Loved", color: "#F48FB1" },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const MoodTracker = () => {
  const dispatch = useDispatch();
  const moodMap = useSelector((state) => state.mood.moods);
  const status = useSelector((state) => state.mood.status);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const realToday = new Date();
  const [displayDate, setDisplayDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);

  const displayYear = displayDate.getFullYear();
  const displayMonth = displayDate.getMonth();
  const isCurrentMonth =
    displayYear === realToday.getFullYear() &&
    displayMonth === realToday.getMonth();

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDay = new Date(displayYear, displayMonth, 1).getDay();

  const activeMood = selectedMood
    ? MOODS.find((m) => m.key === selectedMood)
    : undefined;

  const calendarCells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  useEffect(() => {
    dispatch(fetchMoods({ year: displayYear, month: displayMonth + 1 }));
  }, [displayYear, displayMonth, dispatch]);

  const prevMonth = () =>
    setDisplayDate(new Date(displayYear, displayMonth - 1, 1));
  const nextMonth = () =>
    setDisplayDate(new Date(displayYear, displayMonth + 1, 1));

  const handleDayPress = (day) => {
    if (!selectedMood) return;
    if (isCurrentMonth && day > realToday.getDate()) return;

    const dateStr = dayKey(displayYear, displayMonth, day);

    const existingMood = moodMap[dateStr];
    console.log(moodMap[dateStr]?.mood, status, "hellp");

    if (existingMood) {
      dispatch(
        updateMood({
          id: existingMood.id,
          moodKey: selectedMood,
        }),
      );
    } else {
      dispatch(
        addMood({
          date: dateStr,
          moodKey: selectedMood,
        }),
      );
    }
  };

  const monthStr = String(displayMonth + 1).padStart(2, "0");
  const loggedCount = Object.keys(moodMap).filter((k) =>
    k.startsWith(`${displayYear}-${monthStr}-`),
  ).length;

  const streak = (() => {
    let s = 0;
    const today = new Date();

    const cursor = new Date(today);

    for (let i = 0; i < 365; i++) {
      const y = cursor.getFullYear();
      const m = cursor.getMonth();
      const d = cursor.getDate();
      const k = dayKey(y, m, d);

      if (moodMap[k]?.mood) {
        s++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    return s;
  })();

  const topEmoji = (() => {
    const counts = {};
    Object.entries(moodMap).forEach(([k, v]) => {
      if (k.startsWith(`${displayYear}-${monthStr}-`)) {
        Object.entries(moodMap).forEach(([k, v]) => {
          if (k.startsWith(`${displayYear}-${monthStr}-`)) {
            const mood = v.mood;
            counts[mood] = (counts[mood] ?? 0) + 1;
          }
        });
      }
    });
    if (!Object.keys(counts).length) return null;
    const topKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return MOODS.find((m) => m.key === topKey)?.emoji ?? null;
  })();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative overflow-auto"
      style={{ backgroundImage: `url(${img})` }}
    >
      <Sidebar
        active="Mood"
        bgc="#FFF0F6eb"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen ml-32 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-2">
            <p className="text-sm font-bold tracking-[3px] uppercase text-[#b64e5f]">
              HOW ARE YOU FEELING?
            </p>
            {activeMood ? (
              <p className="text-lg font-bold italic text-[#b64e5f] mt-2">
                Tap any day below to log{" "}
                <span style={{ color: activeMood.color }}>
                  {activeMood.label} {activeMood.emoji}
                </span>
              </p>
            ) : (
              <p className="text-lg font-bold italic text-[#b64e5f] mt-2">
                Select a mood sticker on the right ☝️
              </p>
            )}
          </div>

          <div className="flex gap-12 pt-4 items-start justify-center">
            <div className="w-[700px]">
              <div className="bg-[#f7e5e1] shadow-[#b64e5f] rounded-3xl px-8 pb-8 pt-4 border border-[#b64e5f]/30 shadow-2xl">
                <p className="text-center text-2xl text-gray-400">● ● ●</p>

                <div className="flex items-center justify-between mb-6 px-4">
                  <button
                    onClick={prevMonth}
                    className="text-5xl text-[#b64e5f] hover:text-white transition active:scale-90"
                  >
                    ←
                  </button>
                  <h1 className="text-5xl font-extrabold text-[#b64e5f] tracking-tighter">
                    {MONTH_NAMES[displayMonth]} {displayYear}
                  </h1>
                  <button
                    onClick={nextMonth}
                    className="text-5xl text-[#b64e5f] hover:text-white transition active:scale-90"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-6">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day}
                      className="text-center text-lg font-bold uppercase text-[#b64e5f]"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {calendarCells.map((day, idx) => {
                    if (day === null)
                      return <div key={idx} className="aspect-square" />;

                    const k = dayKey(displayYear, displayMonth, day);
                    const moodKey = moodMap[k]?.mood;
                    const moodCfg = moodKey
                      ? MOODS.find((m) => m.key === moodKey)
                      : undefined;
                    const isToday =
                      isCurrentMonth && day === realToday.getDate();
                    const isFuture =
                      isCurrentMonth && day > realToday.getDate();

                    const bgColor = moodCfg
                      ? moodCfg.color
                      : isToday
                        ? "rgba(255,255,255,0.15)"
                        : "#ee6381";

                    return (
                      <button
                        key={k}
                        disabled={isFuture}
                        onClick={() => handleDayPress(day)}
                        className={`aspect-square shadow-lg border border-[#b64e5f] shadow-[#b64e5f] rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-95 overflow-hidden
                          ${isFuture ? "opacity-60 cursor-not-allowed" : "hover:brightness-110"}
                          ${isToday && !moodCfg ? "ring-4 ring-[#c8b4ff]" : ""}`}
                        style={{ backgroundColor: bgColor }}
                      >
                        <span
                          className={`text-2xl font-medium ${moodCfg || isToday ? "text-white" : "text-white/90"}`}
                        >
                          {day}
                        </span>
                        {moodCfg && (
                          <span className="text-5xl absolute bottom-3 drop-shadow-md">
                            {moodCfg.emoji}
                          </span>
                        )}
                        {isToday && !moodCfg && (
                          <div className="absolute bottom-4 w-3 h-3 bg-[#c8b4ff] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-8">
              <div className="grid grid-cols-2 gap-4">
                {MOODS.map((mood) => {
                  const isActive = selectedMood === mood.key;
                  return (
                    <button
                      key={mood.key}
                      onClick={() =>
                        setSelectedMood(isActive ? null : mood.key)
                      }
                      className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center transition-all active:scale-95 border-2 border-white/30 shadow-xl
                        ${isActive ? "shadow-2xl ring-4 ring-white" : "hover:shadow-2xl"}`}
                      style={{
                        backgroundColor: isActive ? mood.color : "#ee6381",
                      }}
                    >
                      <span className="text-4xl mb-1.5">{mood.emoji}</span>
                      <span
                        className={`text-sm font-bold tracking-wider ${isActive ? "text-white" : "text-[#FFC]"}`}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-16">
            <div className="bg-[#f7e5e1] shadow-[#b64e5f] rounded-3xl py-6 text-center border border-white shadow-lg">
              <div className="text-5xl font-extrabold text-[#b64e5f]">
                {loggedCount}
                <span className="text-lg align-super text-[#b64e5f]/70">
                  /{daysInMonth}
                </span>
              </div>
              <div className="text-xs font-bold tracking-widest uppercase text-[#b64e5f] mt-1">
                LOGGED
              </div>
            </div>

            <div className="bg-[#f7e5e1] shadow-[#b64e5f] rounded-3xl py-6 text-center border border-white shadow-lg">
              <div className="text-5xl font-extrabold text-[#b64e5f]">
                {streak}
                <span className="text-lg align-super text-[#b64e5f]/70">d</span>
              </div>
              <div className="text-xs font-bold tracking-widest uppercase text-[#b64e5f] mt-1">
                STREAK
              </div>
            </div>

            <div className="bg-[#f7e5e1] shadow-[#b64e5f] rounded-3xl py-6 text-center border border-white shadow-lg">
              <div className="text-5xl font-extrabold text-[#b64e5f]">
                {topEmoji || "—"}
              </div>
              <div className="text-xs font-bold tracking-widest uppercase text-[#b64e5f] mt-1">
                TOP MOOD
              </div>
            </div>
          </div>

          {status === "loading" && (
            <p className="text-center text-[#b64e5f] mt-8">
              Saving to server...
            </p>
          )}
          <p className="text-center text-white/60 text-sm mt-12">
            Data saved in your browser • Made By Muskan 🌸
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
