import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';

const getWishlistFromLocalStorage = () => {
  const storedWishlist = localStorage.getItem('wishlist');
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlistAsync',
  async (bookId, thunkAPI) => {
    try {
      await api.post(`/api/wishlist/add/${bookId}`);
      return bookId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlistAsync',
  async (bookId, thunkAPI) => {
    try {
      await api.delete(`/api/wishlist/remove/${bookId}`);
      return bookId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/api/wishlist');
      console.log('Данные избранного:', response.data); 
      return response.data.books.map(book => book.id); 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const fetchWishlistDetails = createAsyncThunk(
  'wishlist/fetchWishlistDetails',
  async (wishlistIds, thunkAPI) => {
    try {
      const response = await api.get('/api/wishlist', { ids: wishlistIds });
      return response.data.books; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: getWishlistFromLocalStorage(), 
    bookDetails: [], 
    isLoading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.bookDetails = [];
      localStorage.removeItem('wishlist');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.items.push(action.payload); 
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(id => id !== action.payload);
        state.bookDetails = state.bookDetails.filter(book => book.id !== action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      })
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload; 
        localStorage.setItem('wishlist', JSON.stringify(action.payload));
        state.isLoading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchWishlistDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishlistDetails.fulfilled, (state, action) => {
        state.bookDetails = action.payload; 
        state.isLoading = false;
      })
      .addCase(fetchWishlistDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
