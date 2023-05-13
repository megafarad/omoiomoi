import { configureStore } from '@reduxjs/toolkit';
import meetingsReducer from '../redux/meetingsSlice';
import searchReducer from '../redux/searchSlice';
import dateRangeReducer from '../redux/dateRangeSlice';
export default configureStore({
  reducer: {
    meetings: meetingsReducer,
    search: searchReducer,
    dateRange: dateRangeReducer
  }
})
