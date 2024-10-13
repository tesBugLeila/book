const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

// Роут для создания покупки (доступно всем авторизованным пользователям)
router.post('/', authMiddleware, purchaseController.createPurchase);

// Роут для получения всех покупок (доступно администратору)
router.get('/', authMiddleware, adminMiddleware, purchaseController.getAllPurchases);

// Роут для получения покупок пользователя по его ID
router.get('/:userId', authMiddleware, purchaseController.getPurchasesByUserId);

//массовая покупка
router.post('/bulk', authMiddleware, purchaseController.createBulkPurchase);

module.exports = router;
