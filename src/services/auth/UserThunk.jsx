import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = "http://localhost:8000/api/user";
// Login
export const login = createAsyncThunk(
    "user/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/signin`,
                { email, password },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    } 
);

// Signup
export const signup = createAsyncThunk(
  "user/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, { name, email, password }, { withCredentials: true });
      return response.data; // { user, token } 
    } catch (error) {
      if (error.response?.status === 409) {
        return rejectWithValue("This email is already registered! Try logging in instead 💕");
      }
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Fetch Current User
export const fetchCurrentUser = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/verify`, {
                withCredentials: true,
            });
            // console.log(response.data)
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch current user";
            console.log(errorMessage)
            return rejectWithValue(errorMessage);
        }
    }
);

// Logout
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/users/logout`,
                {},
                { withCredentials: true }
            )
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong while logging out";
            return rejectWithValue(errorMessage);
        }
    }
);