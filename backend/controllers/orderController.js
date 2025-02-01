import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id })
            .populate('items.itemId');

        if (!cart || !cart.items.length) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        const orders = [];

        for (const cartItem of cart.items) {
            if (!cartItem.itemId) continue;

            const order = new Order({
                buyerId: req.user._id,
                sellerId: cartItem.itemId.sellerId,
                itemId: cartItem.itemId._id,
                quantity: cartItem.quantity,
                totalAmount: cartItem.itemId.price * cartItem.quantity,
                status: 'pending'
            });

            await order.save();
            orders.push(order);
        }

        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const generateOrderOTP = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const otp = generateOTP();
        order.otp = otp;
        order.otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        order.status = 'otpGenerated'; // Update status
        await order.save();

        res.json({
            success: true,
            otp
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { buyerId: req.user._id },
                { sellerId: req.user._id }
            ]
        }).populate([
            { path: 'itemId', select: 'name price image' },
            { path: 'buyerId', select: 'firstName lastName' },
            { path: 'sellerId', select: 'firstName lastName' }
        ]);

        res.json({
            success: true,
            orders: orders // Send as array, not object
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const regenerateOTP = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order || order.buyerId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const otp = generateOTP();
        order.otp = otp;
        order.otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await order.save();

        res.json({ success: true, otp });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const isValid = await order.verifyOTP(otp);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Update both status fields
        order.status = 'completed';
        order.isCompleted = true;
        await order.save();

        res.json({
            success: true,
            message: 'Order completed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getPendingDeliveries = async (req, res) => {
    try {
        const orders = await Order.find({
            sellerId: req.user._id,
            status: { $ne: 'completed' }
        }).populate('itemId buyerId');

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const completeDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const { otp } = req.body;

        const order = await Order.findOne({
            _id: id,
            sellerId: req.user._id,
            isCompleted: false
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (Date.now() > order.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired'
            });
        }

        const isValid = await order.verifyOTP(otp);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        order.isCompleted = true;
        await order.save();

        res.json({
            success: true,
            message: 'Delivery completed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};