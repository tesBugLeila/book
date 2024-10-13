import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from './api';


const getCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem('cart');
  const parsedCart = storedCart ? JSON.parse(storedCart) : [];

  return parsedCart.filter(id => id && id !== 'undefined');
};

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (bookId, thunkAPI) => {
    try {
      if (!bookId) {
        throw new Error('bookId is undefined');
      }
      await api.post(`/api/cart/add/${bookId}`);
      return bookId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async (bookId, thunkAPI) => {
    try {
      if (!bookId) {
        throw new Error('bookId is undefined');
      }
      await api.delete(`/api/cart/remove/${bookId}`);
      return bookId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/api/cart');
      return response.data.books;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromLocalStorage(), 
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart'); 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCartAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      const bookId = action.payload;
      if (bookId && bookId !== 'undefined' && !state.items.includes(bookId)) { 
        state.items.push(bookId);
      }
    });
    builder.addCase(addToCartAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Ошибка при добавлении в корзину';
    });

    builder.addCase(removeFromCartAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = state.items.filter((id) => id !== action.payload);
    });
    builder.addCase(removeFromCartAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Ошибка при удалении из корзины';
    });

    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.isLoading = false;
      const validItems = action.payload.filter(id => id && id !== 'undefined');
      state.items = validItems;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload?.message || 'Ошибка при получении корзины';
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
