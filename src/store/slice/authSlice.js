// store/slice/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../../service/apiServices/loginService";
import { verifyOtpApi } from "../../service/apiServices/otpService";
import { setAccessToken, setRefreshToken, removeTokens, saveTokens } from "../../utils/tokensUtils";
import { ROLES } from "../../utils/roleConstants";

// Thunk: Credentials-based login
export const loginWithCredentials = createAsyncThunk(
    "auth/loginWithCredentials",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await loginApi({ email, password });
            saveTokens({
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
            });
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Thunk: OTP-based login
export const loginWithOtp = createAsyncThunk(
    "auth/loginWithOtp",
    async ({ mobile, otp }, { rejectWithValue }) => {
        try {
            let mobileNumber = mobile;
            let otpNumber = otp
            const response = await verifyOtpApi(mobileNumber, otpNumber);
            saveTokens({
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
            });
            return response;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    role: null,
    loading: false,
    status: "idle",
    error: null,
    userId: null,
    name: null,
    email: null,
    isExistingUser: false,
    isAdmin: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            removeTokens();
            Object.assign(state, initialState);
        },
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Credentials login
        builder
            .addCase(loginWithCredentials.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginWithCredentials.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.accessToken = action.payload.access_token;
                state.refreshToken = action.payload.refresh_token;
                state.role = action.payload.role || ROLES.USER;
                state.userId = action.payload.userDetails.userId;
                state.name = action.payload.userDetails.name;
                state.email = action.payload.userDetails.email;
                state.isExistingUser = true;
                state.isAdmin = action.payload.role === ROLES.ADMIN;
            })
            .addCase(loginWithCredentials.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.error = action.payload;
            });

        // OTP login
        builder
            .addCase(loginWithOtp.pending, (state) => {
                state.loading = true;
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginWithOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.status = "succeeded";
                state.isAuthenticated = true;
                state.accessToken = action.payload.access_token;
                state.refreshToken = action.payload.refresh_token;
                state.role = action.payload.role || ROLES.USER;
                state.userId = action.payload.userDetails.userId;
                state.name = action.payload.userDetails.name;
                state.email = action.payload.userDetails.email;
                state.isExistingUser = true;
                state.isAdmin = action.payload.role === ROLES.ADMIN;
            })
            .addCase(loginWithOtp.rejected, (state, action) => {
                state.loading = false;
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

// Actions
export const { logout, clearAuthError } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectRole = (state) => state.auth.role;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthUser = (state) => ({
    userId: state.auth.userId,
    name: state.auth.name,
    email: state.auth.email,
});

export default authSlice.reducer;
