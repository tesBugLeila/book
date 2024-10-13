import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from './api';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/books');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Ошибка получения книг');
  }
});

export const createBook = createAsyncThunk('books/createBook', async (bookData, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    Object.keys(bookData).forEach(key => {
      formData.append(key, bookData[key]);
    });
    const response = await axios.post('/api/books', formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Ошибка добавления книги');
  }
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (bookId, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/books/${bookId}`);
    return bookId;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Ошибка удаления книги');
  }
});

export const updateBook = createAsyncThunk('books/updateBook', async ({ bookId, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/books/${bookId}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Ошибка обновления книги');
  }
});


export const fetchBookById = createAsyncThunk('books/fetchBookById', async (bookId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/books/${bookId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Ошибка получения книги');
  }
});


export const clearSelectedBook = () => ({
  type: 'books/clearSelectedBook',
});

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    selectedBook: null,
    isLoadingBooks: false,
    isLoadingSelectedBook: false,
    errorBooks: null,
    errorSelectedBook: null,
  },
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoadingBooks = true;
        state.errorBooks = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoadingBooks = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoadingBooks = false;
        state.errorBooks = action.payload;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.isLoadingSelectedBook = true;
        state.errorSelectedBook = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.isLoadingSelectedBook = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.isLoadingSelectedBook = false;
        state.errorSelectedBook = action.payload;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.id !== action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      });
  },
});

export default booksSlice.reducer;
