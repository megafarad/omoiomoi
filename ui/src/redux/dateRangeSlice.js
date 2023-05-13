import { createSlice } from '@reduxjs/toolkit';

export const dateRangeSlice = createSlice({
  name: 'dateRange',
  initialState: {
    fromDate: null,
    toDate: null
  },
  reducers: {
    setFromDate: (state, action) => {
      state.fromDate = action.payload;
    },
    setToDate: (state, action) => {
      state.toDate = action.payload;
    }
  }
});

export const { setFromDate, setToDate } = dateRangeSlice.actions;

export default dateRangeSlice.reducer;
