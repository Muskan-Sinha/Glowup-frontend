import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://glowup-backend-production.up.railway.app/";

export const addMood = createAsyncThunk(
  "mood/addMood",
  async ({ date, moodKey }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}/addmood`,
        {
          date,
          moodname: moodKey
        },
        {
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save mood"
      );
    }
  }
);
export const fetchMoods = createAsyncThunk(
  "mood/fetchMoods",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE}/getmoodbymonth/month`, 
        {
          params: { year, month },
          withCredentials: true         
        }
      );
      return response.data;  
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch moods");
    }
  }
);

export const updateMood = createAsyncThunk(
  "mood/updateMood",
  async ({ id, moodKey }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE}/updatemood/${id}`,
        { moodname: moodKey },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);