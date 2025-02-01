import express from 'express';
import { 
    createOrder, 
    getOrders, 
    generateOrderOTP, 
    verifyOTP, 
    getPendingDeliveries, 
    completeDelivery 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new order from cart
router.post('/create', protect, createOrder);

// Get all orders for user (bought/sold)
router.get('/', protect, getOrders);

// Generate new OTP for order (buyer only)
router.post('/:id/generate-otp', protect, generateOrderOTP);

// Verify OTP and complete order (seller only)
router.post('/:id/verify-otp', protect, verifyOTP);

// Get pending deliveries (seller only)
router.get('/pending-deliveries', protect, getPendingDeliveries);

// Complete delivery after OTP verification
router.put('/:id/complete', protect, completeDelivery);

export default router;