import { useState } from 'react';
import { OrderServices } from '../services/OrderServices';

const OrderCard = ({ order, type, onGenerateOTP }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-[#023047] mb-2">
                        {order.itemId.name}
                    </h3>
                    <p className="text-gray-600">Status: {order.status}</p>
                    <p className="text-gray-600">Quantity: {order.quantity}</p>
                    <p className="text-gray-600">Total: ₹{order.totalAmount}</p>
                    <p className="text-gray-600">
                        {type === 'sold' ? 'Buyer: ' : 'Seller: '}
                        {type === 'sold' 
                            ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
                            : `${order.sellerId.firstName} ${order.sellerId.lastName}`
                        }
                    </p>
                </div>

                {type === 'pending' && order.status === 'pending' && (
                    <button
                        onClick={() => onGenerateOTP(order._id)}
                        className="bg-[#219EBC] text-white px-4 py-2 rounded-lg"
                    >
                        Generate OTP
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderCard;