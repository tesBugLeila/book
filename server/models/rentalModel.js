

const admin = require('firebase-admin');
const db = admin.firestore();

// Модель аренды
class Rental {
  static collection = db.collection('rentals');

  // Создание аренды
  static async create(rentalData) {
    const docRef = await this.collection.add({
      ...rentalData,
      reminderSent: false, 
      reminderDate: null,  
    });
    return { id: docRef.id, ...rentalData, reminderSent: false, reminderDate: null };
  }

  // Обновление аренды (например, после отправки напоминания)
  static async update(rentalId, updateData) {
    await this.collection.doc(rentalId).update(updateData);
  }

  // Получение всех аренд
  static async getAllRentals() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Получение аренд пользователя
  static async getUserRentals(userId) {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Получение аренды по ID
  static async getById(rentalId) {
    const doc = await this.collection.doc(rentalId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Удаление аренды
  static async delete(rentalId) {
    await this.collection.doc(rentalId).delete();
  }

  // Метод для проверки наличия активной аренды
  static async findOne(query) {
    const snapshot = await this.collection
      .where('bookId', '==', query.bookId)
      .where('userId', '==', query.userId)
      .where('status', '==', 'active')
      .get();

    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0]; 
    }
    return null; 
  }
}

module.exports = Rental;
