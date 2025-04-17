import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCategories,
  editPrice,
  uploadPrice,
} from '../../service/apiServices/scrapRatesService';

// Dynamic function to transform any category data into a unified array
function transformData(inputData) {
  const outputData = [];
  for (const category in inputData) {
    if (inputData.hasOwnProperty(category)) {
      const categoryData = inputData[category];
      categoryData.forEach((item) => {
        outputData.push({ ...item, type: category });
      });
    }
  }
  return outputData;
}

// Async thunks
export const fetchCategoriesThunk = createAsyncThunk(
  'price/fetchCategories',
  async () => {
    const response = await fetchCategories();
    return transformData(response); // Transform the response before returning it
  }
);

export const editPriceThunk = createAsyncThunk(
  'price/editPrice',
  async (priceData) => {
    const response = await editPrice(priceData);
    return response;
  }
);

export const uploadPriceThunk = createAsyncThunk(
  'price/uploadPrice',
  async (priceData) => {
    const response = await uploadPrice(priceData);
    return response;
  }
);

// Slice
const priceSlice = createSlice({
  name: 'price',
  initialState: {
    categories: [], // Holds transformed categories and their prices
    types: [], // Holds unique types derived from the categories
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null, // Holds any error messages
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategoriesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload; // Populate transformed categories
        state.types = [...new Set(action.payload.map((item) => item.type))]; // Extract unique types
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Edit price
    builder
      .addCase(editPriceThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editPriceThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedPrice = action.payload;
        const index = state.categories.findIndex(
          (item) => item.id === updatedPrice.id
        );
        if (index !== -1) {
          state.categories[index] = updatedPrice;
        }
      })
      .addCase(editPriceThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    // Upload price
    builder
      .addCase(uploadPriceThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadPriceThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newPrice = action.payload;
        state.categories.push(newPrice);
        if (!state.types.includes(newPrice.type)) {
          state.types.push(newPrice.type); // Add new type if not already in the array
        }
      })
      .addCase(uploadPriceThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default priceSlice.reducer;
