import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://glowup-backend-production.up.railway.app/api/goal";

export const fetchGoals = createAsyncThunk(
    "goal/getgoal",
  async (_, { rejectWithValue }) => {         
    try {
      const response = await axios.get(
        `${API_BASE}/getgoal`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch goals"
      );
    }
  }
)

export const createGoal = createAsyncThunk(
  "goal/creategoal",
  async (goalData, { rejectWithValue }) => { 
    try {
      const response = await axios.post(
        `${API_BASE}/creategoal`,
        goalData,                             
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create goal"
      );
    }
  }
);

export const updateGoal = createAsyncThunk(
  "goal/updategoal",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/updategoal/${id}`,
        updates,
        { withCredentials: true }
      );
      return response.data;                     
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update goal"
      );
    }
  }
);

export const deleteGoal = createAsyncThunk(
  "goal/deletegoal",
  async (goalId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_BASE}/deletegoal/${goalId}`,  
        { withCredentials: true }
      );
      return goalId;                         
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete goal"
      ); 
    }
  }
);

export const updatelog = createAsyncThunk(
  "goal/updatelog",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE}/updatelog/${id}`,
        updates,
        { withCredentials: true }
      );
      return response.data;                     
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update goal log"
      );
    }
  }
);

