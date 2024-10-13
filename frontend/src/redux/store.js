
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import rentalsReducer from './rentalsSlice'; 
import purchasesReducer from './purchasesSlice'; 
import adminReducer from './adminSlice'; 

const store = configureStore({
  reducer: {
    books: booksReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    rentals: rentalsReducer, 
    purchases: purchasesReducer, 
    admin: adminReducer, 
  },
});


store.subscribe(() => {
  const state = store.getState();
  
  if (state.cart.items.length > 0) {
    const validCartItems = state.cart.items.filter(id => id && id !== 'undefined');
    localStorage.setItem('cart', JSON.stringify(validCartItems));
  } else {
    localStorage.removeItem('cart');
  }

  if (state.wishlist.items.length > 0) {
    const validWishlistItems = state.wishlist.items.filter(id => id && id !== 'undefined');
    localStorage.setItem('wishlist', JSON.stringify(validWishlistItems));
  } else {
    localStorage.removeItem('wishlist');
  }
});

export default store;
