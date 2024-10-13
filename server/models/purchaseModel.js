const admin = require('firebase-admin');
const db = admin.firestore();

class Purchase {
  static collection = db.collection('purchases');

  // Создание новой покупки
  static async create(purchaseData) {
    const docRef = await this.collection.add(purchaseData);
    return { id: docRef.id, ...purchaseData };
  }

  // Получение всех покупок
  static async getAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Получение покупок пользователя по его ID
  static async getByUserId(userId) {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Purchase;
