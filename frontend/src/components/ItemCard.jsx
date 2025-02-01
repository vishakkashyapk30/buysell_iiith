import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const ItemCard = ({ item, disableClick = false, showDeleteButton = false, onDelete }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        // Don't navigate if clicking delete button or if clicks are disabled
        if (disableClick || e.target.closest('.delete-button')) return;
        navigate(`/item/${item._id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete?.(item._id);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
        >
            {showDeleteButton && (
                <button
                    onClick={handleDelete}
                    className="delete-button absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                    <FaTrash size={16} />
                </button>
            )}
            
            <img
                src={item.image.url}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4 hover:opacity-90 transition-opacity"
            />

            <div className="space-y-2">
                {/* Item Name */}
                <h3 className="font-bold text-xl text-[#023047] line-clamp-2 min-h-[3.5rem]">
                    {item.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-[#219EBC]">₹</span>
                    <span className="text-2xl font-bold text-[#023047]">
                        {item.price.toLocaleString('en-IN')}
                    </span>
                </div>

                {/* Category Badge */}
                <span className="inline-block bg-[#219EBC] text-white px-3 py-1 rounded-full text-sm">
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>

                {/* Seller Info */}
                <div className="pt-2 border-t border-gray-100 mt-2">
                    <p className="text-sm text-gray-600">
                        Seller: <span className="font-medium text-[#023047]">
                            {item.sellerId.firstName} {item.sellerId.lastName}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;