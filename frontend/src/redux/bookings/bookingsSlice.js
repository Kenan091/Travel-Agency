import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import bookingsService from './bookingsService';

export const getBookings = createAsyncThunk(
  'bookings/getBookings',
  async (destinationId, thunkAPI) => {
    try {
      if (destinationId) {
        return await bookingsService.getBookingsFromAPI(destinationId);
      } else {
        return await bookingsService.getBookingsFromAPI();
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

export const getBooking = createAsyncThunk(
  'bookings/getBooking',
  async (bookingId, thunkAPI) => {
    try {
      return await bookingsService.getBookingFromAPI(bookingId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await bookingsService.createBookingInAPI(bookingData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkDestinationBooking = createAsyncThunk(
  'bookings/checkDestinationBooking',
  async (checkData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      return await bookingsService.checkDestinationBookingFromAPI(
        checkData,
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

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ bookingId, updatedData }, thunkAPI) => {
    try {
      return await bookingsService.updateBookingFromAPI(bookingId, updatedData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (bookingId, thunkAPI) => {
    try {
      return await bookingsService.deleteBookingFromAPI(bookingId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const bookingsSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    booking: null,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getBookings.pending, state => {
        state.isLoading = true;
      })
      .addCase(getBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBooking.pending, state => {
        state.isLoading = true;
      })
      .addCase(getBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.booking = action.payload.booking;
      })
      .addCase(getBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBooking.pending, state => {
        state.isLoading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkDestinationBooking.pending, state => {
        state.isLoading = true;
      })
      .addCase(checkDestinationBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        // Handle success, e.g., display a message to the user
      })
      .addCase(checkDestinationBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBooking.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(
          b => b._id === updatedBooking._id
        );
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBooking.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedBookingId = action.payload._id;
        state.bookings = state.bookings.filter(b => b._id !== deletedBookingId);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default bookingsSlice.reducer;
