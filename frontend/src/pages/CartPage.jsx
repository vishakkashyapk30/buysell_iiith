import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CartServices } from '../services/CartServices';
import { OrderServices } from '../services/OrderServices';
import { FaTrash } from 'react-icons/fa';

const CartPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchCart = async () => {
        try {
            const result = await CartServices.getCart();
            if (result.success) {
                // Filter out self-listed items
                const filteredItems = result.cart.items.filter(
                    item => item.itemId?.sellerId !== user?._id
                );
                setCart({
                    ...result.cart,
                    items: filteredItems
                });
            }
        } catch (error) {
            setError("Error fetching cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const handleRemoveItem = async (itemId) => {
        try {
            const result = await CartServices.removeFromCart(itemId);
            if (result.success) {
                fetchCart();
                setSuccess('Item removed from cart');
            }
        } catch (error) {
            setError('Failed to remove item');
        }
    };

    const handlePlaceOrder = async () => {
        try {
            setOrderLoading(true);
            setError('');
    
            const result = await OrderServices.createOrder();
    
            if (result.success) {
                setSuccess('Order placed successfully! Go to Orders History to generate OTP.');
                await fetchCart();
                setTimeout(() => navigate('/orders'), 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to place order');
        } finally {
            setOrderLoading(false);
        }
    };

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => {
            return total + ((item?.itemId?.price || 0) * (item?.quantity || 0));
        }, 0);
    };

    return (
        <div className="fixed inset-0 overflow-auto bg-[#8BDAFF]">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-[15px] p-8 max-w-[800px] mx-auto">
                    <h1 className="text-[32px] font-bold text-[#023047] mb-8 text-center">
                        My Cart
                    </h1>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                            {success}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center text-gray-600">Loading...</div>
                    ) : !cart?.items?.length ? (
                        <div className="text-center text-gray-600">Your cart is empty</div>
                    ) : (
                        <>
                            <div className="space-y-6 mb-8">
                                {cart.items.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={item.itemId?.image?.url}
                                                alt={item.itemId?.name}
                                                className="w-24 h-24 object-cover rounded"
                                            />
                                            <div>
                                                <h3 className="font-bold text-black">
                                                    {item.itemId?.name}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="font-bold text-black">
                                                    ₹{(item.itemId?.price || 0) * item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.itemId._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xl font-bold text-black">Total:</span>
                                    <span className="text-2xl font-bold text-[#023047]">
                                        ₹{calculateTotal()}
                                    </span>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={orderLoading}
                                    className="w-full bg-[#219EBC] text-white py-3 rounded-lg hover:bg-[#E56F2E] transition-colors disabled:opacity-50"
                                >
                                    {orderLoading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;