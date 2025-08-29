// store/slice/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserDetailsById,
  fetchUserDetailsByPhoneNumber,
} from "../../service/apiServices/userService";
import {
  addAddressApi,
  deleteAddressApi,
  editAddressApi,
} from "../../service/apiServices/addressService";
import { ROLES } from "../../utils/roleConstants";

/* ==========================================================
   USER CRUD THUNKS
   ========================================================== */

// Fetch user by phone number
export const fetchUserByPhoneNumber = createAsyncThunk(
  "user/fetchUserByPhoneNumber",
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const res = await fetchUserDetailsByPhoneNumber(phoneNumber);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetchUserDetailsById(userId);
      return res.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add new address
export const addAddress = createAsyncThunk(
  "user/addAddress",
  async (address, { dispatch, rejectWithValue }) => {
    try {
      await addAddressApi(address);
      await dispatch(fetchUserByPhoneNumber(address.userPhoneNumber)); // refresh user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Edit address
export const editAddress = createAsyncThunk(
  "user/editAddress",
  async (address, { dispatch, rejectWithValue }) => {
    try {
      await editAddressApi(address.userId, address.addressId, address);
      await dispatch(fetchUserByPhoneNumber(address.userPhoneNumber)); // refresh user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      await deleteAddressApi(data.userId, data.currentAddressId);
      await dispatch(fetchUserByPhoneNumber(data.userPhoneNumber)); // refresh user
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/* ==========================================================
   SLICE
   ========================================================== */

const initialState = {
  user: null,
  role: null,
  status: "idle",
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      /* ------------------ Fetch User by Phone ------------------ */
      .addCase(fetchUserByPhoneNumber.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.isExistingUser = null;
      })
      .addCase(fetchUserByPhoneNumber.fulfilled, (state, action) => {
        if (action.payload.message === "User not found") {
          state.user = null;
          state.role = null;
        } else {
          const { role, ...user } = action.payload;
          state.user = user;
          state.role = role || ROLES.USER;
        }
        state.status = "succeeded";
      })
      .addCase(fetchUserByPhoneNumber.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ------------------ Fetch User by ID ------------------ */
      .addCase(fetchUserById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const { role, ...user } = action.payload;
        state.user = user;
        state.role = role || ROLES.USER;
        state.status = "succeeded";
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* ------------------ Address CRUD ------------------ */
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

/* ==========================================================
   EXPORTS
   ========================================================== */

export const { clearUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectRole = (state) => state.user.role;
export const selectIsUser = (state) => state.user.role === ROLES.USER;

export default userSlice.reducer;
