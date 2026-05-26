import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vectorApi } from '../../api/vector';
import type { SearchRequest, SearchResult } from '../../types';

interface SearchState {
  results: SearchResult[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  query: string;
}

const initialState: SearchState = {
  results: [],
  totalCount: 0,
  isLoading: false,
  error: null,
  query: '',
};

export const searchCandidates = createAsyncThunk(
  'search/searchCandidates',
  async (data: SearchRequest, { rejectWithValue }) => {
    try {
      return await vectorApi.search(data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      return rejectWithValue(err.response?.data?.detail || 'Search failed');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCandidates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload?.candidates || [];
        state.totalCount = action.payload?.total_count || 0;
      })
      .addCase(searchCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
