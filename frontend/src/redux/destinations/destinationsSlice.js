import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import destinationsService from './destinationsService';

export const getDestinations = createAsyncThunk(
  'destinations/getDestinations',
  async thunkAPI => {
    try {
      return await destinationsService.getDestinationsFromAPI();
    } catch (error) {
      const message =
        (error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getDestination = createAsyncThunk(
  'destinations/getDestination',
  async (destinationId, thunkAPI) => {
    try {
      return await destinationsService.getDestinationFromAPI(destinationId);
    } catch (error) {
      const message =
        (error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addDestination = createAsyncThunk(
  'destinations/addDestination',
  async (destinationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await destinationsService.addDestinationToAPI(
        destinationData,
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

export const updateDestination = createAsyncThunk(
  'destinations/updateDestination',
  async ({ destinationId, updatedData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await destinationsService.updateDestinationFromAPI(
        destinationId,
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

export const deleteDestination = createAsyncThunk(
  'destinations/deleteDestination',
  async (destinationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await destinationsService.deleteDestinationFromAPI(
        destinationId,
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

const destinationsSlice = createSlice({
  name: 'destination',
  initialState: {
    destinations: [],
    destination: null,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDestinations.pending, state => {
        state.isLoading = true;
      })
      .addCase(getDestinations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.destinations = action.payload;
      })
      .addCase(getDestinations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getDestination.pending, state => {
        state.isLoading = true;
      })
      .addCase(getDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        state.destination = action.payload;
      })
      .addCase(getDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addDestination.pending, state => {
        state.isLoading = true;
      })
      .addCase(addDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        state?.destinations.push(action.payload.data);
      })
      .addCase(addDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateDestination.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedDestination = action.payload.data;
        const index = state?.destinations?.findIndex(
          d => d._id === updatedDestination._id
        );
        if (index !== -1) {
          state.destinations[index] = updatedDestination;
        }
      })
      .addCase(updateDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteDestination.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedDestinationId = action.payload.data._id;
        state.destinations = state?.destinations?.filter(
          d => d._id !== deletedDestinationId
        );
      })
      .addCase(deleteDestination.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default destinationsSlice.reducer;
