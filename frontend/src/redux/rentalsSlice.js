// redux/rentalsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

export const createRental = createAsyncThunk(
  'rentals/createRental',
  async ({ bookId, rentalDuration }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/rentals/rent`, { bookId, rentalDuration });
      return response.data.rental;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Ошибка при аренде');
    }
  }
);

export const fetchRentals = createAsyncThunk(
  'rentals/fetchRentals',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/rentals/user-rentals/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Ошибка при получении аренд');
    }
  }
);

export const returnRent = createAsyncThunk(
  'rentals/returnRent',
  async (rentalId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/rentals/rent/${rentalId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Ошибка при получение аренды по id');
    }
  }
);

export const returnBook = createAsyncThunk(
  'rentals/returnBook',
  async (rentalId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/rentals/rent/${rentalId}`);
      return response.data.message;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Ошибка при возврате книги');
    }
  }
);

export const fetchAllRentals = createAsyncThunk('admin/fetchAllRentals', async () => {
  const response = await api.get('/api/rentals/all-rentals');
  return response.data;
});

export const deleteRental = createAsyncThunk('admin/deleteRental', async (rentalId) => {
  await api.delete(`api/rentals/rent/${rentalId}`);
  return rentalId;
});

export const updateRentalStatus = createAsyncThunk('admin/updateRentalStatus', async ({ rentalId, newStatus }) => {
  const response = await api.put(`/api/rentals/${rentalId}`, { status: newStatus });
  return response.data;
});

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState: {
    rentals: [],
    loading: false,
    error: null,
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRental.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRental.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals.push(action.payload);
      })
      .addCase(createRental.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRentals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentals.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals = action.payload;
      })
      .addCase(fetchRentals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(returnBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals = state.rentals.filter(rental => rental.id !== action.meta.arg);
      })
      .addCase(returnBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllRentals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRentals.fulfilled, (state, action) => {
        state.loading = false;
        state.rentals = action.payload;
      })
      .addCase(fetchAllRentals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteRental.fulfilled, (state, action) => {
        state.rentals = state.rentals.filter((rental) => rental.id !== action.payload);
      })
      .addCase(updateRentalStatus.fulfilled, (state, action) => {
        const index = state.rentals.findIndex((rental) => rental.id === action.payload.id);
        if (index !== -1) {
          state.rentals[index] = action.payload;
        }
      });
  },
});

export default rentalsSlice.reducer;
