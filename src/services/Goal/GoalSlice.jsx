import { createSlice } from "@reduxjs/toolkit";
import {
  createGoal,
  deleteGoal,
  fetchGoals,
  updateGoal,
  updatelog,
} from "./GoalThunk";

const goalSlice = createSlice({
  name: "goals",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    activeFilter: "all",
  },
  reducers: {
    addGoalLocal(state, action) {
      const tempId = `local_${Date.now()}`;
      state.items.push({
        ...action.payload,
        id: tempId,
        tempId,
        completedDates: [],
        createdAt: new Date().toISOString(),
      });
    },

    removeGoalLocal(state, action) {
      state.items = state.items.filter((h) => h.id !== action.payload);
    },

    updateGoalLocal(state, action) {
      const { id, updates } = action.payload;
      const goal = state.items.find((h) => h.id === id);
      if (goal) Object.assign(goal, updates);
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
      .addCase(fetchGoals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load goals";
      });
    builder
      .addCase(createGoal.pending, (state) => {
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        const localIdx = state.items.findIndex(
          (h) => typeof h.id === "string" && h.id.startsWith("local_"),
        );
        if (localIdx !== -1) {
          state.items[localIdx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.error = action.payload ?? "Failed";
      });
    builder
      .addCase(updateGoal.fulfilled, (state, action) => {
        const goal = state.items.find((h) => h._id === action.payload._id);
        if (goal) Object.assign(goal, action.payload);
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update goal";
      });
    builder
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((h) => h._id !== action.payload);
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete goal";
      });
    builder
      .addCase(updatelog.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((h) => h._id === updated._id);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(updatelog.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to save goal log";
      });
  },
});

export const {
  addGoalLocal,
  removeGoalLocal,
  updateGoalLocal,
  setFilter,
  setView,
  clearError,
} = goalSlice.actions;

export default goalSlice.reducer;
