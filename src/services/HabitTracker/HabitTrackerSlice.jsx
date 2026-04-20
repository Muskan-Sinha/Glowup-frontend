import { createSlice } from "@reduxjs/toolkit";
import {
  fetchHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitLog,
  todayStr,
} from "./HabitTrackerThunk";

// const daysAgo = (n) =>
//   new Date(Date.now() - n * 86400000).toISOString().split("T")[0];

const habitSlice = createSlice({
  name: "habits",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    activeFilter: "all",
    view: "today",
  },
  reducers: {
    addHabitLocal(state, action) {
      const tempId = `local_${Date.now()}`;
      state.items.push({
        ...action.payload,
        id: tempId,
        tempId,
        completedDates: [],
        createdAt: new Date().toISOString(),
      });
    },

    toggleTodayLocal(state, action) {
      const habit = state.items.find((h) => h.id === action.payload);
      if (!habit) return;
      const today = todayStr();
      const idx = habit.completedDates.indexOf(today);
      if (idx === -1) {
        habit.completedDates.push(today);
      } else {
        habit.completedDates.splice(idx, 1);
      }
    },

    removeHabitLocal(state, action) {
      state.items = state.items.filter((h) => h.id !== action.payload);
    },

    updateHabitLocal(state, action) {
      const { id, updates } = action.payload;
      const habit = state.items.find((h) => h.id === id);
      if (habit) Object.assign(habit, updates);
    },

    setFilter(state, action) {
      state.activeFilter = action.payload;
    },

    setView(state, action) {
      state.view = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.items = action.payload;
        }
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load habits";
      });
    builder
      .addCase(createHabit.pending, (state) => {
        state.error = null;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        const localIdx = state.items.findIndex(
          (h) => typeof h.id === "string" && h.id.startsWith("local_"),
        );
        if (localIdx !== -1) {
          state.items[localIdx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      });
    builder
      .addCase(updateHabit.fulfilled, (state, action) => {
        const habit = state.items.find((h) => h.id === action.payload.id);
        if (habit) Object.assign(habit, action.payload);
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update habit";
      });
    builder
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.items = state.items.filter((h) => h.id !== action.payload);
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete habit";
      });
    builder
      .addCase(toggleHabitLog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(toggleHabitLog.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to save habit log";

        const payload = action.payload;
        const habitId = payload?.habitId;
        const date = payload?.date;

        if (!habitId || !date) return;

        const habit = state.items.find((h) => h.id === habitId);
        if (!habit) return;

        const idx = habit.completedDates.indexOf(date);
        if (idx !== -1) {
          habit.completedDates.splice(idx, 1);
        } else {
          habit.completedDates.push(date);
        }
      });
  },
});

export const {
  addHabitLocal,
  toggleTodayLocal,
  removeHabitLocal,
  updateHabitLocal,
  setFilter,
  setView,
  clearError,
} = habitSlice.actions;

export default habitSlice.reducer;
