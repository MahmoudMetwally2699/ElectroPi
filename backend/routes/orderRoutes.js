const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, getOrderStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// User routes
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/stats', protect, admin, getOrderStats);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
