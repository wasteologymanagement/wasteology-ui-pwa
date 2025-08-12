import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAccessToken } from "../../utils/tokensUtils";
import { fetchUserDetails } from "../../service/apiServices/userService";
import {
  addAddressApi,
  deleteAddressApi,
  editAddressApi,
} from "../../service/apiServices/addressService";
import { ROLES } from "../../utils/roleConstants";

// Thunk: Fetch user by phone number (OTP login)
export const fetchUserByPhoneNumber = createAsyncThunk(
  "user/fetchUserByPhoneNumber",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await fetchUserDetails(phoneNumber);
      console.log("User fetch response:", response);
      return response;
    } catch (error) {
      console.error("Fetch user error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Add new address
export const addAddress = createAsyncThunk(
  "user/addAddress",
  async (address, { dispatch, rejectWithValue }) => {
    try {
      await addAddressApi(address);
      await dispatch(fetchUserByPhoneNumber(address.userPhoneNumber));
    } catch (error) {
      console.log("error in slice : ", error)
      return rejectWithValue(error);
    }
  }
);

// Thunk: Edit address
export const editAddress = createAsyncThunk(
  "user/editAddress",
  async (address, { dispatch, rejectWithValue }) => {
    try {
      await editAddressApi(address.userId, address.addressId, address);
      await dispatch(fetchUserByPhoneNumber(address.userPhoneNumber));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Delete address
export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await deleteAddressApi(data.userId, data.currentAddressId);
      await dispatch(fetchUserByPhoneNumber(data.userPhoneNumber));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  role: null, // 'user', 'admin', or 'picker'
  isAuthenticated: false,
  isExistingUser: false,
  isAdmin: false, // Deprecated in favor of role (but kept for backward compatibility)
  status: "idle",
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // For OTP-based user login
    loginSuccess: (state, action) => {
      const { role, ...user } = action.payload;
      state.user = user;
      state.role = role || "user"; // fallback for users
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.isExistingUser = true;
      state.isAdmin = role === ROLES.ADMIN;
    },

    // For admin/picker login
    loginAdminSuccess: (state, action) => {
      const { role, ...user } = action.payload;
      state.user = user;
      state.role = role; // must be explicitly provided
      state.isAuthenticated = true;
      state.status = "succeeded";
      state.isExistingUser = null;
      state.isAdmin = role === ROLES.ADMIN; // backward compat
    },

    // Logout and clear everything
    logout: (state) => {
      Object.assign(state, initialState);
    },

    clearUser: (state) => {
      Object.assign(state, initialState);
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch user by phone number
      .addCase(fetchUserByPhoneNumber.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.isExistingUser = null;
      })
      .addCase(fetchUserByPhoneNumber.fulfilled, (state, action) => {
        if (action.payload.message === "User not found") {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
          state.isExistingUser = false;
        } else {
          const { role, ...user } = action.payload;
          state.user = user;
          state.role = role || "user";
          state.isAuthenticated = true;
          state.isExistingUser = true;
        }
        state.status = "succeeded";
      })
      .addCase(fetchUserByPhoneNumber.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isExistingUser = null;
      })

      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Edit Address
      .addCase(editAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(editAddress.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators
export const { loginSuccess, loginAdminSuccess, logout, clearUser } =
  userSlice.actions;

// Selector helpers (optional)
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUser = (state) => state.user.user;
export const selectRole = (state) => state.user.role;
export const selectIsAdmin = (state) => state.user.role === ROLES.ADMIN;
export const selectIsPicker = (state) => state.user.role === ROLES.PICKER;
export const selectIsUser = (state) => state.user.role === ROLES.USER;

export default userSlice.reducer;
