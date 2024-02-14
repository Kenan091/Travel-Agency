import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../auth/authService';

// let user;

// Get user from localStorage
// const storedUser = localStorage.getItem('user');

// console.log('Stored User:', storedUser);

// if (storedUser !== undefined && storedUser !== '' && storedUser !== null) {
//   try {
//     user = JSON.parse(storedUser);
//     console.log('Parsed User:', user);
//   } catch (error) {
//     console.error('Error parsing user:', error);
//   }
// }

const user = JSON.parse(localStorage.getItem('user'));
// const user = JSON.parse(localStorage.getItem('user'));
console.log(user);

// Async action for user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message =
        (error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async action for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Function for user logout
export const logoutUser = createAsyncThunk('auth/logout', () => {
  authService.logout();
});

// Async action for getting the current user
export const getMe = createAsyncThunk('auth/getMe', async thunkAPI => {
  try {
    const token = thunkAPI.getState().auth.user.token;

    return await authService.getMeFromAPI(token);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.error) ||
      error.error ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Async action for updating user details
export const updateDetails = createAsyncThunk(
  'auth/updateDetails',
  async (updatedDetails, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.updateDetailsFromAPI(updatedDetails, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async action for updating user password
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, thunkAPI) => {
    try {
      return await authService.updatePasswordFromAPI(passwordData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/// Async action for forgetting password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      return await authService.forgotPasswordFromAPI(email);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async action for resetting password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ resetToken, newPassword }, thunkAPI) => {
    try {
      return await authService.resetPasswordFromAPI(resetToken, newPassword);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.error ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user ? user : null,
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
      })
      .addCase(getMe.pending, state => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(updateDetails.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        // Handle success, e.g., display a message to the user
        // You might display a message indicating that details have been updated
      })
      .addCase(updateDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(updatePassword.pending, state => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle success, e.g., display a message to the user
        // You might display a message indicating that the password has been updated
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(forgotPassword.pending, state => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.isLoading = false;
        // Handle success, e.g., display a message to the user
        // You might display a message indicating that a password reset email has been sent
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      .addCase(resetPassword.pending, state => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle success, e.g., redirect to login page
        // You might redirect the user to the login page with a success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
