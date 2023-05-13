import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    pageNumber: 0,
    page: null,
    query: '',
    isLoading: false
  },
  reducers: {
    incrementSearchPageNumber: (state) => {
      state.pageNumber += 1;
    },
    decrementSearchPageNumber: (state) => {
      state.pageNumber -= 1;
    },
    setSearchPage: (state, action) => {
      state.page = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setIsSearchLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { incrementSearchPageNumber, decrementSearchPageNumber,
  setSearchPage, setSearchQuery,
  setIsSearchLoading} = searchSlice.actions;

export default searchSlice.reducer;
