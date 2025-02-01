import { useState } from 'react';
import { OrderServices } from '../services/OrderServices';

const DeliveryCard = ({ order, onVerificationSuccess }) => {
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');

    const handleVerifyOTP = async () => {
        try {
            setVerifying(true);
            setError('');
            const result = await OrderServices.verifyOTP(order._id, otp);
            if (result.success) {
                onVerificationSuccess(order._id);
            }
        } catch (error) {
            setError('Invalid OTP');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-[#023047] mb-2">
                        {order.itemId.name}
                    </h3>
                    <p className="text-gray-600">Quantity: {order.quantity}</p>
                    <p className="text-gray-600">Total: ₹{order.totalAmount}</p>
                    <p className="text-gray-600">
                        Buyer: {order.buyerId.firstName} {order.buyerId.lastName}
                    </p>
                    <p className={`font-bold ${order.status === 'completed' ? 'text-green-500' : 'text-orange-500'}`}>
                        Status: {order.status}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="p-2 border rounded w-32 text-black"
                        maxLength={6}
                    />
                    <button
                        onClick={handleVerifyOTP}
                        disabled={verifying || !otp}
                        className="bg-[#219EBC] text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {verifying ? 'Verifying...' : 'Complete Delivery'}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default DeliveryCard;