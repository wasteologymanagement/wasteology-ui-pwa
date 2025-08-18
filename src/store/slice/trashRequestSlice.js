import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllTrashRequest } from "../../service/apiServices/pickupRequestService";

// --- Thunks (Async Actions) ---
// Fetch all trash requests
export const getAllTrashRequests = createAsyncThunk(
  "trashRequest/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllTrashRequest();
    //   return response.data;

      // Transform rows here for DataGrid
      const transformed = response.data.map((req) => ({
        requestId: req.requestId,
        firstName: req.firstName,
        lastName: req.lastName,
        fullName: `${req.firstName} ${req.lastName}`,
        email: req.email,
        pickupDate: req.pickupDate,
        pickupTime: req.pickupTime,
        mobileNumber: req.mobileNumber,
        approxWeight: req.approxWeight,
        status: req.status,
        userId: req.userId,
        addressId: req.address.addressId,
        address: `${req.address.addressLine1}, ${req.address.addressLine2}, ${req.address.street}, ${req.address.city}, ${req.address.state} - ${req.address.zip}, ${req.address.country}`,
        // items: req.items.map(
        //   (i) => `${i.type} (${i.quantity}${i.unit ?? ""})`
        // ).join(", "), // e.g. "Plastic (5), Glass (10)"
        items: req.items
      }));

      return transformed;

    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch trash requests"
      );
    }
  }
);

// --- Slice ---
const trashRequestSlice = createSlice({
  name: "trashRequest",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    message: null,
    selected: null,
  },
  reducers: {
    resetTrashRequestState: (state) => {
      state.requests = [];
      state.loading = false;
      state.error = null;
      state.selected = null
    },
     clearMessage(state) {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllTrashRequests
      .addCase(getAllTrashRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTrashRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getAllTrashRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Actions & Reducer
export const { resetTrashRequestState, clearMessage } = trashRequestSlice.actions;
export default trashRequestSlice.reducer;
