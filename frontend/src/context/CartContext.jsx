import { createContext, useContext, useState, useCallback } from 'react';
import axios from '../axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);

    const addToCart = useCallback(async (itemId, quantity = 1) => {
        try {
            const response = await axios.post('/api/cart/add', { itemId, quantity });
            setCart(response.data.cart);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    }, []);

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);