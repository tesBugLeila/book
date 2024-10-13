const express = require('express');
const { register, login, getAllUsers, deleteUser, updateUser, getUserByToken } = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Регистрация пользователя
router.post('/register', register);

// Вход в систему
router.post('/login', login);

// Получение пользователя по токену
router.get('/me', authMiddleware, getUserByToken);

// Получение всех пользователей (только для администраторов)
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

// Удаление пользователя (только для администраторов)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

// Обновление информации о пользователе (только для администраторов)
router.put('/:id', authMiddleware, adminMiddleware, updateUser);

module.exports = router;
