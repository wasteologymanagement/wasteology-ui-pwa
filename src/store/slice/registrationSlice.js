import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { registerUserApi } from '../../service/apiServices/userService';

// Async thunk to handle registration
export const registerUser = createAsyncThunk(
  'registration/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData); // Replace with your API endpoint
      return response;
      // return "response";
    } catch (error) {
      // Return a rejected value with a custom error message
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

// Initial state
const initialState = {
  userData: null, // Will store user data upon successful registration
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Error message, if any
};

// Create the slice
const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Reset state to idle and clear errors if needed
    resetRegistrationState: (state) => {
      state.status = 'idle';
      state.error = null;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to register';
      });
  },
});

// Export the reducer and actions
export const { resetRegistrationState } = registrationSlice.actions;
export default registrationSlice.reducer;
