const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addBookToCart, removeBookFromCart, getCart } = require('../controllers/cartController');

const router = express.Router();

// Получение корзины пользователя
router.get('/', authMiddleware, getCart);

// Добавление книги в корзину
router.post('/add/:bookId', authMiddleware, addBookToCart);

// Удаление книги из корзины
router.delete('/remove/:bookId', authMiddleware, removeBookFromCart);

module.exports = router;
