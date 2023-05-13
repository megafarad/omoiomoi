import { createSlice } from '@reduxjs/toolkit';

export const meetingsSlice = createSlice({
    name: 'meetings',
    initialState: {
      pageNumber: 0,
      page: null,
      isLoading: false
    },
    reducers: {
      incrementMeetingPageNumber: (state) => {
        state.pageNumber += 1;
      },
      decrementMeetingPageNumber: (state) => {
        state.pageNumber -= 1;
      },
      setMeetingPage: (state, action) => {
        state.page = action.payload;
      },
      setAreMeetingsLoading: (state, action) => {
        state.isLoading = action.payload;
      }
    }
  }
);

export const { incrementMeetingPageNumber, decrementMeetingPageNumber,
  setMeetingPage, setAreMeetingsLoading} = meetingsSlice.actions;

export default meetingsSlice.reducer;




