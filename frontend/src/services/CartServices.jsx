import axios from '../axios';

const addToCart = async (itemId, quantity = 1) => {
    try {
        const response = await axios.post('/api/cart/add', { itemId, quantity });
        return { success: true, cart: response.data.cart };
    } catch (error) {
        console.error('Add to cart error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add to cart'
        };
    }
};

const getCart = async () => {
    try {
        const response = await axios.get('/api/cart');
        return response.data;
    } catch (error) {
        console.error('Get cart error:', error);
        throw error;
    }
};

const removeFromCart = async (itemId) => {
    try {
        const response = await axios.delete(`/api/cart/remove/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Remove from cart error:', error);
        throw error;
    }
}

export const CartServices = {
    addToCart,
    getCart,
    removeFromCart
};