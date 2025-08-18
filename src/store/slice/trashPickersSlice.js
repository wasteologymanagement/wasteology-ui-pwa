import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllTrashPickers,
  getAllActiveTrashPickers,
  getTrashPickerById,
  registerTrashPicker,
  updateTrashPicker,
  softDeleteTrashPicker,
  deleteTrashPicker,
  activateSoftDeletedTrashPicker
} from "../../service/apiServices/trashPickersService";

/* ---------------------------------- THUNKS ---------------------------------- */

// 📌 Fetch all
export const fetchTrashPickersThunk = createAsyncThunk(
  "trashPicker/fetchAll",
  async () => {
    const response = await getAllTrashPickers();
    return response.data;
  }
);

// 📌 Fetch active only
export const fetchActiveTrashPickersThunk = createAsyncThunk(
  "trashPicker/fetchActive",
  async () => {
    const response = await getAllActiveTrashPickers();
    return response.data;
  }
);

// 📌 Fetch by ID
export const fetchTrashPickerByIdThunk = createAsyncThunk(
  "trashPicker/fetchById",
  async (id) => {
    const response = await getTrashPickerById(id);
    return response.data;
  }
);

// 📌 Create
export const createTrashPickerThunk = createAsyncThunk(
  "trashPicker/create",
  async (payload) => {
    const response = await registerTrashPicker(payload);
    return response.data;
  }
);

// 📌 Update
export const updateTrashPickerThunk = createAsyncThunk(
  "trashPicker/update",
  async ({ id, payload }) => {
    const response = await updateTrashPicker(id, payload);
    return response.data;
  }
);

// 📌 Soft delete
export const softDeleteTrashPickerThunk = createAsyncThunk(
  "trashPicker/softDelete",
  async (id) => {
    await softDeleteTrashPicker(id);
    return id;
  }
);

// 📌 Permanent delete
export const permanentDeleteTrashPickerThunk = createAsyncThunk(
  "trashPicker/permanentDelete",
  async (id) => {
    await deleteTrashPicker(id);
    return id;
  }
);

// 📌 Activate
export const activateTrashPickerThunk = createAsyncThunk(
  "trashPicker/activate",
  async (id) => {
    const response = await activateSoftDeletedTrashPicker(id);
    return response.data; // { message, data }
  }
);

/* ---------------------------------- SLICE ---------------------------------- */

const trashPickerSlice = createSlice({
  name: "trashPicker",
  initialState: {
    trashPickers: [],
    selected: null,
    status: "idle",
    error: null,
    message: null
  },
  reducers: {
    clearMessage(state) {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* ---- Fetch All ---- */
      .addCase(fetchTrashPickersThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrashPickersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trashPickers = action.payload.map((picker) => ({
          ...picker,
          active: picker.active ?? true
        }));
      })
      .addCase(fetchTrashPickersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      /* ---- Fetch Active ---- */
      .addCase(fetchActiveTrashPickersThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveTrashPickersThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trashPickers = action.payload.map((picker) => ({
          ...picker,
          active: true
        }));
      })
      .addCase(fetchActiveTrashPickersThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      /* ---- Fetch By ID ---- */
      .addCase(fetchTrashPickerByIdThunk.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      /* ---- Create ---- */
      .addCase(createTrashPickerThunk.fulfilled, (state, action) => {
        state.trashPickers.push({ ...action.payload, active: true });
      })

      /* ---- Update ---- */
      .addCase(updateTrashPickerThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.trashPickers.findIndex((p) => p.pickerId === updated.pickerId);
        if (index !== -1) {
          state.trashPickers[index] = {
            ...updated,
            active: updated.active ?? state.trashPickers[index].active
          };
        }
      })

      /* ---- Soft Delete ---- */
      .addCase(softDeleteTrashPickerThunk.fulfilled, (state, action) => {
        const pickerId = action.payload;
        const index = state.trashPickers.findIndex((p) => p.pickerId === pickerId);
        if (index !== -1) {
          state.trashPickers[index].active = false;
          state.trashPickers[index].status = 'SUSPENDED';
        }
      })

      /* ---- Permanent Delete ---- */
      .addCase(permanentDeleteTrashPickerThunk.fulfilled, (state, action) => {
        const pickerId = action.payload;
        state.trashPickers = state.trashPickers.filter((p) => p.pickerId !== pickerId);
      })

      /* ---- Activate ---- */
      .addCase(activateTrashPickerThunk.fulfilled, (state, action) => {
        const updatedPicker = action.payload;
        console.log(' action updated payload : ', action.payload)
        const index = state.trashPickers.findIndex((p) => p.pickerId === updatedPicker.pickerId);
        if (index !== -1) {
          state.trashPickers[index] = { ...updatedPicker, active: true, status: 'ACTIVE' };
        } else {
          state.trashPickers.push({ ...updatedPicker, active: true, status: 'ACTIVE' });
        }
        state.message = action.payload.message || "Trash picker activated successfully";
      });
  }
});

export const { clearMessage } = trashPickerSlice.actions;
export default trashPickerSlice.reducer;
