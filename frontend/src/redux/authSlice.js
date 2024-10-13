
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      window.localStorage.setItem('token', response.data.token); 
      return response.data; 
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Ошибка при авторизации' });
      }
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users/register', { username, email, password });
      window.localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Ошибка при регистрации' });
      }
    }
  }
);

export const fetchUserByToken = createAsyncThunk(
  'auth/fetchUserByToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users/me');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Ошибка получения пользователя' });
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      window.localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Логин
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; 
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.message !== 'Недействительный токен') {
          state.error = action.payload;
        } else {
          state.error = null; 
        }
        state.user = null;
        state.token = null;
        window.localStorage.removeItem('token');
      })
      // Регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; 
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.message !== 'Недействительный токен') {
          state.error = action.payload;
        } else {
          state.error = null; 
        }
        state.user = null;
        state.token = null;
        window.localStorage.removeItem('token');
      })
      // Получение пользователя по токену
      .addCase(fetchUserByToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserByToken.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.message !== 'Недействительный токен') {
          state.error = action.payload;
        } else {
          state.error = null;
        }
        state.user = null;
        state.token = null;
        window.localStorage.removeItem('token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
