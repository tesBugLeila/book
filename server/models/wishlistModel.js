const admin = require('firebase-admin');
const db = admin.firestore();
const Books = require('../models/bookModel'); 

class Wishlist {
  static collection = db.collection('wishlists');

  // Добавление книги в избранное
  static async addBookToWishlist(userId, bookId) {
    const wishlistRef = this.collection.doc(userId);
    const wishlistDoc = await wishlistRef.get();

    if (wishlistDoc.exists) {
      const wishlistData = wishlistDoc.data();
      if (!wishlistData.books.includes(bookId)) {
        const updatedBooks = [...wishlistData.books, bookId];
        await wishlistRef.update({ books: updatedBooks });
      }
    } else {
      await wishlistRef.set({ books: [bookId] });
    }
  }

  // Удаление книги из избранного
  static async removeBookFromWishlist(userId, bookId) {
    const wishlistRef = this.collection.doc(userId);
    const wishlistDoc = await wishlistRef.get();

    if (wishlistDoc.exists) {
      const wishlistData = wishlistDoc.data();
      const updatedBooks = wishlistData.books.filter(id => id !== bookId);
      await wishlistRef.update({ books: updatedBooks });
    }
  }

  // Получение избранного пользователя
  static async getWishlist(userId) {
    const wishlistDoc = await this.collection.doc(userId).get();
    const wishlistData = wishlistDoc.exists ? wishlistDoc.data() : { books: [] };

    // Получение информации о книгах
    const booksInfo = await Books.getBooksByIds(wishlistData.books);
    return { books: booksInfo }; 
  }
}

module.exports = Wishlist;
