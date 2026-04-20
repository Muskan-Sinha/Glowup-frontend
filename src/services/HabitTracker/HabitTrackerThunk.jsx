import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://glowup-backend-production.up.railway.app/";

export const todayStr = () => new Date().toISOString().split("T")[0];

export const getLast7 = (completedDates = []) => {
  const dateSet = new Set(completedDates);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return dateSet.has(d.toISOString().split("T")[0]);
  });
};

export const calcStreak = (completedDates = []) => {
  if (!completedDates.length) return 0;
  const dateSet = new Set(completedDates);
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (dateSet.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const fetchHabits = createAsyncThunk(
  "habits/gethabitbyuser",
  async (_, { rejectWithValue }) => {         
    try {
      const response = await axios.get(
        `${API_BASE}/gethabitbyuser`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch habits"
      );
    }
  }
);
export const createHabit = createAsyncThunk(
  "habits/createhabit",
  async (habitData, { rejectWithValue }) => { 
    try {
      const response = await axios.post(
        `${API_BASE}/createhabit`,
        habitData,                             
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create habit"
      );
    }
  }
);

export const updateHabit = createAsyncThunk(
  "habits/updatehabit",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/updatehabit/${id}`,
        updates,
        { withCredentials: true }
      );
      return response.data;                     
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update habit"
      );
    }
  }
);

export const deleteHabit = createAsyncThunk(
  "habits/deletehabit",
  async (habitId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_BASE}/deletehabit/${habitId}`,  
        { withCredentials: true }
      );
      return habitId;                         
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete habit"
      ); 
    }
  }
);

export const toggleHabitLog = createAsyncThunk(
  "habits/logahabit",
  async ({ habitId, date, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/loghabit`,
        { habitId, date, status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        habitId,
        date,
        message: error.response?.data?.message || "Failed to save log",
      });
    }
  }
);


export const selectAllHabits = (state) => state.habits.items;
export const selectHabitsStatus = (state) => state.habits.status;
export const selectHabitsError = (state) => state.habits.error;
export const selectFilter = (state) => state.habits.activeFilter;
export const selectView = (state) => state.habits.view;

export const selectHabitWithStats = (state) =>
  state.habits.items.map((h) => ({
    ...h,
    streak:         calcStreak(h.completedDates),
    completedToday: h.completedDates.includes(todayStr()),
    totalCompleted: h.completedDates.length,
    last7:          getLast7(h.completedDates),
  }));

export const selectTodayProgress = (state) => {
  const habits = state.habits.items;
  const today  = todayStr();
  const done   = habits.filter((h) => h.completedDates.includes(today)).length;
  const total  = habits.length;
  return {
    done,
    total,
    pct: total > 0 ? Math.round((done / total) * 100) : 0,
  };
};

export const selectCategoryStats = (state) => {
  const today = todayStr();
  return state.habits.items.reduce((acc, h) => {
    if (!acc[h.category]) acc[h.category] = { done: 0, total: 0, pct: 0 };
    acc[h.category].total++;
    if (h.completedDates.includes(today)) acc[h.category].done++;
    acc[h.category].pct = Math.round(
      (acc[h.category].done / acc[h.category].total) * 100
    );
    return acc;
  }, {});
};

export const selectHabitById = (id) => (state) =>
  state.habits.items.find((h) => h.id === id) ?? null;