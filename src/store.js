import { configureStore } from '@reduxjs/toolkit';
import MoodReducer from "./services/MoodTracker/MoodSlice.jsx"
import authReducer from "./services/auth/UserSlice.jsx"
import habitReducer from "./services/HabitTracker/HabitTrackerSlice.jsx"
import GoalReducer from "./services/Goal/GoalSlice.jsx"
import journalReducer from "./services/Journal/JournalSlice.jsx"
export const store = configureStore({
  reducer: {
    journal: journalReducer,
    goals: GoalReducer,
    mood: MoodReducer,
    user: authReducer,
    habits: habitReducer
  },
});