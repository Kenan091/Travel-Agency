import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import feedbacksService from './feedbacksService';

export const getFeedbacks = createAsyncThunk(
  'feedbacks/getFeedbacks',
  async thunkAPI => {
    try {
      return await feedbacksService.getFeedbacksFromAPI();
    } catch (error) {
      const message =
        (error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addFeedback = createAsyncThunk(
  'feedbacks/addFeedback',
  async (feedbackData, thunkAPI) => {
    try {
      return await feedbacksService.addFeedbackToAPI(feedbackData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    feedbacks: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getFeedbacks.pending, state => {
        state.isLoading = true;
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload;
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addFeedback.pending, state => {
        state.isLoading = true;
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default feedbackSlice.reducer;