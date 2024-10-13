

const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const db = admin.firestore();

class User {
  static collection = db.collection('users');

  // Создание нового пользователя
  static async create(userData) {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    userData.role = userData.role || 'user';

    const docRef = await this.collection.add(userData);
    return { id: docRef.id, ...userData };
  }
  
  // Поиск пользователя по email
  static async findByEmail(email) {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  // Сравнение паролей
  static async comparePassword(inputPassword, savedPassword) {
    return bcrypt.compare(inputPassword, savedPassword);
  }

  // Получение пользователя по ID
  static async getById(userId) {
    const doc = await this.collection.doc(userId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  // Получение нескольких пользователей по их ID
  static async getUsersByIds(userIds) {
    const users = [];
    const promises = userIds.map(async (userId) => {
      const user = await this.getById(userId);
      if (user) {
        users.push(user);
      }
    });

    await Promise.all(promises);
    return users;
  }

  // Получение всех пользователей
  static async getAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Удаление пользователя
  static async delete(userId) {
    await this.collection.doc(userId).delete();
  }

  // Обновление информации о пользователе
  static async update(userId, userData) {
    await this.collection.doc(userId).update(userData);
  }
}

module.exports = User;
