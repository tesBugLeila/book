const Cart = require('../models/cartModel');

// Добавление книги в корзину
exports.addBookToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const bookId = req.params.bookId;

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'Неправильные данные. Требуются ID пользователя и книги.' });
    }

    await Cart.addBookToCart(userId, bookId);
    res.status(200).json({ message: 'Книга добавлена в корзину' });
  } catch (error) {
    console.error("Ошибка при добавлении книги в корзину:", error);
    res.status(500).json({ message: 'Ошибка при добавлении книги в корзину', error: error.message });
  }
};

// Удаление книги из корзины
exports.removeBookFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const bookId = req.params.bookId;

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'Неправильные данные. Требуются ID пользователя и книги.' });
    }

    await Cart.removeBookFromCart(userId, bookId);
    res.status(200).json({ message: 'Книга удалена из корзины' });
  } catch (error) {
    console.error("Ошибка при удалении книги из корзины:", error);
    res.status(500).json({ message: 'Ошибка при удалении книги из корзины', error: error.message });
  }
};

// Получение корзины пользователя
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя не передан.' });
    }

    const cart = await Cart.getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Ошибка при получении корзины:", error);
    res.status(500).json({ message: 'Ошибка при получении корзины', error: error.message });
  }
};
