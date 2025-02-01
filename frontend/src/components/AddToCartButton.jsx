import { useState } from 'react';
import { CartServices } from '../services/CartServices';

const AddToCartButton = ({ itemId, quantity = 1 }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddToCart = async () => {
        try {
            setLoading(true);
            setError('');
            await CartServices.addToCart(itemId, quantity);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full px-8 py-4 bg-[#219EBC] text-white rounded-full hover:bg-[#E56F2E] transition-colors disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add to Cart'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default AddToCartButton;