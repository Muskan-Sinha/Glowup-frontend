import { createSlice } from "@reduxjs/toolkit";
import { addMood, fetchMoods, updateMood } from "./MoodThunk.jsx";

const MoodSlice = createSlice({
  name: "mood",
  initialState: {
    moods: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoods.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMoods.fulfilled, (state, action) => {
  state.status = "succeeded";
  (action.payload.moods || []).forEach((item) => {
    const dateKey = item.date.split("T")[0];
    
    state.moods[dateKey] = { id: item._id, mood: item.moodname.toLowerCase() };
  });
})

      .addCase(fetchMoods.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addMood.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addMood.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { date, moodKey } = action.meta.arg;
        state.moods[date] = {
          id: action.payload.mood?._id,
          mood: moodKey.toLowerCase(),
        };
      })
      .addCase(addMood.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
    builder.addCase(updateMood.fulfilled, (state, action) => {
      const mood = action.payload.updatedMood;

      const dateKey = mood.date.split("T")[0];

      state.moods[dateKey] = {
        id: mood._id,
        mood: mood.moodname.toLowerCase(),
      };
    });
  },
});

export default MoodSlice.reducer;
