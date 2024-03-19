import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewsService from '../reviews/reviewsService';

// Async action for getting all reviews
export const getReviews = createAsyncThunk(
  'reviews/getReviews',
  async (destinationId, thunkAPI) => {
    try {
      if (destinationId) {
        return await reviewsService.getReviewsFromAPI(destinationId);
      } else {
        return await reviewsService.getReviewsFromAPI();
      }
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async action for getting a single review
export const getReview = createAsyncThunk(
  'reviews/getReview',
  async (reviewId, thunkAPI) => {
    try {
      return await reviewsService.getReviewFromAPI(reviewId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async action for adding a new review
export const addReview = createAsyncThunk(
  'destinations/addReview',
  async (reviewData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reviewsService.addReviewToAPI(reviewData, token);
    } catch (error) {
      const message =
        (error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async action for updating a review
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, updatedData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      return await reviewsService.updateReviewFromAPI(
        reviewId,
        updatedData,
        token
      );
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async action for deleting a review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      return await reviewsService.deleteReviewFromAPI(reviewId, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const reviewsSlice = createSlice({
  name: 'review',
  initialState: {
    reviews: [],
    review: null,
    averageRatingForDestination: 0,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getReviews.pending, state => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.reviews = action.payload;
        state.averageRatingForDestination = 0;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReview.pending, state => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.review = action.payload;
      })
      .addCase(getReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addReview.pending, state => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state?.reviews?.push(action.payload.review);
        state.averageRatingForDestination = action.payload.averageRating;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateReview.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedReview = action.payload;
        const index = state.reviews.findIndex(r => r._id === updatedReview._id);
        if (index !== -1) {
          state.reviews = [
            ...state.reviews.slice(0, index), // elements before the updated review
            updatedReview, // updated review
            ...state.reviews.slice(index + 1), // elements after the updated review
          ];
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteReview.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.reviews = action.payload.reviews;
        state.averageRatingForDestination = action.payload.averageRating;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default reviewsSlice.reducer;
