const admin = require('firebase-admin');
const db = admin.firestore();

class Book {
  static collection = db.collection('books');

  // Создает новую книгу и добавляет ее в коллекцию
  static async create(bookData) {
    const docRef = await this.collection.add(bookData);
    return { id: docRef.id, ...bookData };
  }

  // Получает все книги из коллекции
  static async getAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Получает книгу по ID
  static async getById(bookId) {
    const doc = await this.collection.doc(bookId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  // Получает книги по массиву ID
static async getBooksByIds(bookIds) {
  const promises = bookIds.map(id => this.getById(id)); 
  const books = await Promise.all(promises); 
  return books.filter(book => book !== null); 
}


  // Удаляет книгу по ID
  static async delete(bookId) {
    await this.collection.doc(bookId).delete();
  }

  // Обновляет данные книги по ID
  static async update(bookId, bookData) {
    const docRef = this.collection.doc(bookId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error('Книга не найдена');
    }

    await docRef.update(bookData);
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }
  

   // Обновляет статус книги
   static async updateStatus(bookId, status) {
    const docRef = this.collection.doc(bookId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error('Книга не найдена');
    }

    await docRef.update({ status });

    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }


}

module.exports = Book;
