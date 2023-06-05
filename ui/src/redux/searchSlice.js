import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import commonRequestParameters from "../app/commonRequestParameters";

export const searchMeetings = createAsyncThunk(
  'search/fetchSearch',
  async (parameters) => {
    const { pageNumber, pageSize, fromDate, toDate, query, token } = parameters;
    const fetchUrl = '/api/meetingEvent?' + commonRequestParameters(pageNumber, pageSize, fromDate, toDate) +
      '&' + new URLSearchParams({
        query: query
      });
    const res = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return await res.json();
  },
);

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    pageNumber: 0,
    page: null,
    query: '',
    isLoading: false,
    error: null,
  },
  reducers: {
    incrementSearchPageNumber: (state) => {
      state.pageNumber += 1;
    },
    decrementSearchPageNumber: (state) => {
      state.pageNumber -= 1;
    },
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchMeetings.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(searchMeetings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.page = action.payload;
    });
    builder.addCase(searchMeetings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    })
  }
});

export const { incrementSearchPageNumber, decrementSearchPageNumber,
  setSearchQuery} = searchSlice.actions;

export default searchSlice.reducer;
