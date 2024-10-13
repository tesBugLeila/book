import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';  



// Thunk для получения всех покупок
export const fetchAllPurchases = createAsyncThunk('purchases/fetchAllPurchases', async () => {
  const response = await api.get('/api/purchases');
  return response.data;
});

// Thunk для создания покупки одной книги
export const createPurchase = createAsyncThunk(
  'purchases/createPurchase',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/purchases', { bookId });
      return response.data.purchase;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка при покупке');
    }
  }
);

// Thunk для создания массовой покупки
export const createBulkPurchase = createAsyncThunk(
  'purchases/createBulkPurchase',
  async (bookIds, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/purchases/bulk', { bookIds });
      return response.data.purchases;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка при массовой покупке');
    }
  }
);

// Thunk для получения покупок конкретного пользователя
export const fetchPurchases = createAsyncThunk(
  'purchases/fetchPurchases',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/purchases/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка при получении покупок');
    }
  }
);


const purchasesSlice = createSlice({
  name: 'purchases',
  initialState: {
    purchases: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchAllPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases.push(action.payload);
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createBulkPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBulkPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = state.purchases.concat(action.payload);
      })
      .addCase(createBulkPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default purchasesSlice.reducer;
