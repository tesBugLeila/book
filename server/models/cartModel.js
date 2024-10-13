const admin = require('firebase-admin');
const db = admin.firestore();

class Cart {
  static collection = db.collection('carts');

  // Добавление книги в корзину
  static async addBookToCart(userId, bookId) {
    const cartRef = this.collection.doc(userId);
    const cartDoc = await cartRef.get();

    if (cartDoc.exists) {
      const cartData = cartDoc.data();
      const updatedBooks = [...new Set([...cartData.books, bookId])]; 
      await cartRef.update({ books: updatedBooks });
    } else {
      await cartRef.set({ books: [bookId] });
    }
  }

  // Удаление книги из корзины
  static async removeBookFromCart(userId, bookId) {
    const cartRef = this.collection.doc(userId);
    const cartDoc = await cartRef.get();

    if (cartDoc.exists) {
      const cartData = cartDoc.data();
      const updatedBooks = cartData.books.filter(id => id !== bookId);
      await cartRef.update({ books: updatedBooks });
    }
  }

  
  // массового удаления книг из корзины
  static async removeBooksFromCart(userId, bookIds) {
    try {
      
      await CartModel.deleteMany({ userId, bookId: { $in: bookIds } });
    } catch (error) {
      console.error('Ошибка при удалении книг из корзины:', error);
      throw error;
    }
  }


  // Получение корзины пользователя
  static async getCart(userId) {
    const cartDoc = await this.collection.doc(userId).get();
    return cartDoc.exists ? cartDoc.data() : { books: [] };
  }
}

module.exports = Cart;
