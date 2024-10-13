import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api';

// Thunks для управления пользователями
export const fetchAllUsers = createAsyncThunk('admin/fetchAllUsers', async () => {
  const response = await axios.get('/api/users');
  return response.data;
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId) => {
  await axios.delete(`/api/users/${userId}`);
  return userId;
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ userId, updatedData }) => {
  const response = await axios.put(`/api/users/${userId}`, updatedData);
  return response.data;
});

// Thunks для управления книгами
export const fetchAllBooks = createAsyncThunk('admin/fetchAllBooks', async () => {
  const response = await axios.get('/api/books');
  return response.data;
});

export const deleteBook = createAsyncThunk('admin/deleteBook', async (bookId) => {
  await axios.delete(`/api/books/${bookId}`);
  return bookId;
});

export const updateBook = createAsyncThunk('admin/updateBook', async ({ bookId, updatedData }) => {
  const response = await axios.put(`/api/books/${bookId}`, updatedData);
  return response.data;
});

// Thunks для управления покупками
export const fetchAllPurchases = createAsyncThunk('admin/fetchAllPurchases', async () => {
  const response = await axios.get('/api/purchases');
  return response.data;
});

export const deletePurchase = createAsyncThunk('admin/deletePurchase', async (purchaseId) => {
  await axios.delete(`/api/purchases/${purchaseId}`);
  return purchaseId;
});

// Thunks для управления арендой
export const fetchAllRentals = createAsyncThunk('admin/fetchAllRentals', async () => {
  const response = await axios.get('/api/rentals/all-rentals');
  return response.data;
});

export const deleteRental = createAsyncThunk('admin/deleteRental', async (rentalId) => {
  await axios.delete(`/api/rentals/${rentalId}`);
  return rentalId;
});

export const updateRentalStatus = createAsyncThunk('admin/updateRentalStatus', async ({ rentalId, newStatus }) => {
  const response = await axios.put(`/api/rentals/${rentalId}`, { status: newStatus });
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    books: [],
    purchases: [],
    rentals: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    // Управление пользователями
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Управление книгами
      .addCase(fetchAllBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })

      // Управление покупками
      .addCase(fetchAllPurchases.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllPurchases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchAllPurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter((purchase) => purchase.id !== action.payload);
      })

      // Управление арендой
      .addCase(fetchAllRentals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllRentals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rentals = action.payload;
      })
      .addCase(fetchAllRentals.rejected, (state, action) => {
        state.isLoading = false;
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

export default adminSlice.reducer;
