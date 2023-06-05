import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import commonRequestParameters from "../app/commonRequestParameters";

export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async (parameters) => {
    const { pageNumber, pageSize, fromDate, toDate, token } = parameters;
    const fetchUrl = '/api/meetings?' + commonRequestParameters(pageNumber, pageSize, fromDate, toDate);
    const res = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await res.json();
  }
)

export const meetingsSlice = createSlice({
    name: 'meetings',
    initialState: {
      pageNumber: 0,
      page: null,
      isLoading: false,
      error: null,
    },
    reducers: {
      incrementMeetingPageNumber: (state) => {
        state.pageNumber += 1;
      },
      decrementMeetingPageNumber: (state) => {
        state.pageNumber -= 1;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(fetchMeetings.pending, (state) => {
        state.isLoading = true;
      });
      builder.addCase(fetchMeetings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.page = action.payload;
      });
      builder.addCase(fetchMeetings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
    },
  }
);

export const { incrementMeetingPageNumber, decrementMeetingPageNumber} = meetingsSlice.actions;

export default meetingsSlice.reducer;




