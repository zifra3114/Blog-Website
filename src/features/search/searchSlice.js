import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as searchApi from '../../api/searchApi.js';

// ─── Async thunks ──────────────────────────────────────────────

export const searchAll = createAsyncThunk(
  'search/searchAll',
  async ({ query, page, limit }, { rejectWithValue }) => {
    try {
      return await searchApi.searchAll(query, page, limit);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error?.message || 'Search failed'
      );
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────────

const initialState = {
  results: null, // { posts: { items, total }, users: { items, total } }
  loading: false,
  error: null,
  query: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = null;
      state.error = null;
      state.query = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setQuery, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
