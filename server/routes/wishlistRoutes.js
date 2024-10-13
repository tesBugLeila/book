
const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addBookToWishlist, removeBookFromWishlist, getWishlist } = require('../controllers/wishlistController');

const router = express.Router();

// Получение избранного пользователя
router.get('/', authMiddleware, getWishlist);

// Добавление книги в избранное
router.post('/add/:bookId', authMiddleware, addBookToWishlist);

// Удаление книги из избранного
router.delete('/remove/:bookId', authMiddleware, removeBookFromWishlist);

module.exports = router;
