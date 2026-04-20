import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "ghttps://glowup-backend-production.up.railway.app/";

export const fetchAllEntries = createAsyncThunk(
  "journal/fetchAll",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/getall`, {
        params: { page, limit },
        withCredentials: true,
      });
      return response.data; // { entries, total, page, totalPages }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch entries");
    }
  }
);

export const fetchOneEntry = createAsyncThunk(
  "journal/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/getone/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch entry");
    }
  }
);

export const fetchByMonth = createAsyncThunk(
  "journal/fetchByMonth",
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/getbymonth`, {
        params: { year, month },
        withCredentials: true,
      });
      return response.data; // { entries }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch month entries");
    }
  }
);

export const createEntry = createAsyncThunk(
  "journal/create",
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/create`, entryData, {
        withCredentials: true,
      });
      return response.data; // full entry object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create entry");
    }
  }
);

export const updateEntry = createAsyncThunk(
  "journal/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}/update/${id}`, updates, {
        withCredentials: true,
      });
      return response.data; // updated entry
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update entry");
    }
  }
);

export const deleteEntry = createAsyncThunk(
  "journal/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`, { withCredentials: true });
      return id; // return id for state filtering
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete entry");
    }
  }
);

export const searchEntries = createAsyncThunk(
  "journal/search",
  async (q, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/search`, {
        params: { q },
        withCredentials: true,
      });
      return response.data; // { entries }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to search entries");
    }
  }
);