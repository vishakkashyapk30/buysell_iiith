import axios from '../axios';

export const OrderServices = {
    async createOrder() {
        try {
            const response = await axios.post('/api/orders/create');
            return response.data;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    },

    async getOrders() {
        try {
            const response = await axios.get('/api/orders');
            return response.data;
        } catch (error) {
            console.error('Get orders error:', error);
            throw error;
        }
    },

    async generateOTP(orderId) {
        try {
            const response = await axios.post(`/api/orders/${orderId}/generate-otp`);
            return response.data;
        } catch (error) {
            console.error('Generate OTP error:', error);
            throw error;
        }
    },

    async verifyOTP(orderId, otp) {
        try {
            const response = await axios.post(`/api/orders/${orderId}/verify-otp`, { otp });
            return response.data;
        } catch (error) {
            console.error('Verify OTP error:', error);
            throw error;
        }
    },

    async getPendingDeliveries() {
        try {
            const response = await axios.get('/api/orders/pending-deliveries');
            return response.data;
        } catch (error) {
            console.error('Get pending deliveries error:', error);
            throw error;
        }
    },

    async completeDelivery(orderId, otp) {
        try {
            const response = await axios.put(`/api/orders/${orderId}/complete`, { otp });
            return response.data;
        } catch (error) {
            console.error('Complete delivery error:', error);
            throw error;
        }
    }
};

export default OrderServices;