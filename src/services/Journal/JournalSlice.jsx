import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllEntries,
  fetchOneEntry,
  fetchByMonth,
  createEntry,
  updateEntry,
  deleteEntry,
  searchEntries,
} from "./JournalThunk";

const journalSlice = createSlice({
  name: "journal",
  initialState: {
    items: [],          // all entries list
    selected: null,     // single entry for detail view
    monthEntries: [],   // calendar month entries
    searchResults: [],  // search results
    isSearching: false,
    searchQuery: "",
    total: 0,
    page: 1,
    totalPages: 1,
    status: "idle",     // idle | loading | succeeded | failed
    error: null,
    activeView: "list", // list | write | read | calendar
  },
  reducers: {
    setView(state, action) {
      state.activeView = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
    },
    clearSearch(state) {
      state.searchResults = [];
      state.isSearching = false;
      state.searchQuery = "";
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchAllEntries ──────────────────────────────────────
    builder
      .addCase(fetchAllEntries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload.entries)
          ? action.payload.entries
          : [];
        state.total = action.payload.total ?? 0;
        state.page = action.payload.page ?? 1;
        state.totalPages = action.payload.totalPages ?? 1;
      })
      .addCase(fetchAllEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load entries";
      });

    // ── fetchOneEntry ────────────────────────────────────────
    builder
      .addCase(fetchOneEntry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOneEntry.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchOneEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load entry";
      });

    // ── fetchByMonth ─────────────────────────────────────────
    builder
      .addCase(fetchByMonth.fulfilled, (state, action) => {
        state.monthEntries = Array.isArray(action.payload.entries)
          ? action.payload.entries
          : [];
      })
      .addCase(fetchByMonth.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to load month";
      });

    // ── createEntry ──────────────────────────────────────────
    builder
      .addCase(createEntry.pending, (state) => {
        state.error = null;
      })
      .addCase(createEntry.fulfilled, (state, action) => {
        state.items.unshift(action.payload); // newest first
        state.total += 1;
        state.selected = action.payload;
        state.activeView = "read"; // go to read after saving
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to save entry";
      });

    // ── updateEntry ──────────────────────────────────────────
    builder
      .addCase(updateEntry.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((e) => e._id === updated._id);
        if (idx !== -1) state.items[idx] = updated;
        if (state.selected?._id === updated._id) state.selected = updated;
        state.activeView = "read";
      })
      .addCase(updateEntry.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update entry";
      });

    // ── deleteEntry ──────────────────────────────────────────
    builder
      .addCase(deleteEntry.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((e) => e._id !== id);
        state.total -= 1;
        if (state.selected?._id === id) state.selected = null;
        state.activeView = "list";
      })
      .addCase(deleteEntry.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete entry";
      });

    // ── searchEntries ────────────────────────────────────────
    builder
      .addCase(searchEntries.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(searchEntries.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = Array.isArray(action.payload.entries)
          ? action.payload.entries
          : [];
      })
      .addCase(searchEntries.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload ?? "Search failed";
      });
  },
});

export const {
  setView,
  clearSelected,
  clearSearch,
  setSearchQuery,
  clearError,
} = journalSlice.actions;

export default journalSlice.reducer;