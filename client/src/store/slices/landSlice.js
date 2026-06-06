import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lands: [],
  currentLand: null,
  myLands: [],
  pendingLands: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  searchFilters: {},
};

const landSlice = createSlice({
  name: 'land',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setLands(state, action) {
      state.lands = action.payload.lands;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
    },
    setCurrentLand(state, action) {
      state.currentLand = action.payload;
    },
    setMyLands(state, action) {
      state.myLands = action.payload;
    },
    setPendingLands(state, action) {
      state.pendingLands = action.payload;
    },
    setSearchFilters(state, action) {
      state.searchFilters = action.payload;
    },
    clearCurrentLand(state) {
      state.currentLand = null;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setLands,
  setCurrentLand,
  setMyLands,
  setPendingLands,
  setSearchFilters,
  clearCurrentLand,
  setError,
  clearError,
} = landSlice.actions;

export default landSlice.reducer;
