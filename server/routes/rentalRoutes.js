const express = require('express');
const rentalController = require('../controllers/rentalController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Маршрут для создания аренды (доступно всем авторизованным пользователям)
router.post('/rent', authMiddleware, rentalController.createRental);

// Маршрут для получения всех аренд (только администратор)
router.get('/all-rentals', authMiddleware, adminMiddleware, rentalController.getAllRentals);

// Маршрут для получения аренд по ID пользователя
router.get('/user-rentals/:userId', authMiddleware, rentalController.getRentalsByUserId);

// Маршрут для получения аренды по ID (доступно всем авторизованным пользователям)
router.get('/rent/:rentalId', authMiddleware, rentalController.getRentalById);

// Маршрут для удаления аренды (доступно авторизованным пользователям)
router.delete('/rent/:rentalId', authMiddleware,  adminMiddleware, rentalController.returnBook);

module.exports = router;
