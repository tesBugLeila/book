const express = require('express');
const multer = require('multer');
const { getAllBooks, createBook, getBookById, updateBook, deleteBook } = require('../controllers/booksController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// Получение всех книг (доступно всем)
router.get('/', getAllBooks);

// Создание новой книги (только для администратора)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createBook);

// Получение книги по ID (доступно всем)
router.get('/:id', getBookById);

// Обновление книги по ID (только для администратора)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateBook);

// Удаление книги по ID (только для администратора)
router.delete('/:id', authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
