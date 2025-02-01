import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiresAt: {
        type: Date,
        default: null
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'otpGenerated', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

orderSchema.pre('save', async function(next) {
    if (this.isModified('otp') && this.otp) {
        this.otp = await bcrypt.hash(this.otp, 10);
    }
    next();
});

orderSchema.methods.verifyOTP = async function(enteredOTP) {
    if (!this.otp) return false;
    return await bcrypt.compare(enteredOTP, this.otp);
};

const Order = mongoose.model('Order', orderSchema);
export default Order;