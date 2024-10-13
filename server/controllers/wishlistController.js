const Wishlist = require('../models/wishlistModel');

// Добавление книги в избранное
exports.addBookToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const bookId = req.params.bookId;

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'Неправильные данные. Требуются ID пользователя и книги.' });
    }

    await Wishlist.addBookToWishlist(userId, bookId);
    res.status(200).json({ message: 'Книга добавлена в избранное' });
  } catch (error) {
    console.error("Ошибка при добавлении книги в избранное:", error);
    res.status(500).json({ message: 'Ошибка при добавлении книги в избранное', error: error.message });
  }
};

// Удаление книги из избранного
exports.removeBookFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const bookId = req.params.bookId;

    if (!userId || !bookId) {
      return res.status(400).json({ message: 'Неправильные данные. Требуются ID пользователя и книги.' });
    }

    await Wishlist.removeBookFromWishlist(userId, bookId);
    res.status(200).json({ message: 'Книга удалена из избранного' });
  } catch (error) {
    console.error("Ошибка при удалении книги из избранного:", error);
    res.status(500).json({ message: 'Ошибка при удалении книги из избранного', error: error.message });
  }
};

// Получение избранного пользователя
exports.getWishlist = async (req, res) => {
    try {
      const userId = req.userId;
  
      if (!userId) {
        return res.status(400).json({ message: 'ID пользователя не передан.' });
      }
  
      const wishlist = await Wishlist.getWishlist(userId);
      res.status(200).json(wishlist);
    } catch (error) {
      console.error("Ошибка при получении избранного:", error);
      res.status(500).json({ message: 'Ошибка при получении избранного', error: error.message });
    }
  };
  