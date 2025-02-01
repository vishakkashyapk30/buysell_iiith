import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { OrderServices } from '../services/OrderServices';
import Navbar from '../components/Navbar';
import OrderCard from '../components/OrderCard';

const OrderHistoryPage = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [orders, setOrders] = useState({
        pending: [],
        bought: [],
        sold: []
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchOrders = async () => {
        try {
            const result = await OrderServices.getOrders();
            
            if (result.success && Array.isArray(result.orders)) {
                const pendingOrders = result.orders.filter(o => 
                    !o.isCompleted && 
                    o.buyerId._id === user._id &&
                    (o.status === 'pending' || o.status === 'otpGenerated')
                );
    
                const boughtOrders = result.orders.filter(o => 
                    o.isCompleted && 
                    o.buyerId._id === user._id &&
                    o.status === 'completed'
                );
    
                const soldOrders = result.orders.filter(o => 
                    o.sellerId._id === user._id
                );
    
                setOrders({
                    pending: pendingOrders,
                    bought: boughtOrders,
                    sold: soldOrders
                });
            }
        } catch (error) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateOTP = async (orderId) => {
        try {
            const result = await OrderServices.generateOTP(orderId);
            if (result.success) {
                setSuccess(`OTP Generated: ${result.otp}. Share this with the seller.`);
                await fetchOrders(); // Refresh orders after OTP generation
            }
        } catch (error) {
            setError('Failed to generate OTP');
        }
    };

    const handleVerifyOTP = async (orderId, otp) => {
        try {
            const result = await OrderServices.verifyOTP(orderId, otp);
            if (result.success) {
                setSuccess('Transaction completed successfully!');
                await fetchOrders(); // Refresh orders after verification
            }
        } catch (error) {
            setError('Invalid OTP');
        }
    };


    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="fixed inset-0 overflow-auto bg-[#8BDAFF]">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-[15px] p-8">
                    <h1 className="text-[32px] font-bold text-[#023047] mb-8">Order History</h1>
                    
                    {success && (
                        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
                            {success}
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex gap-4 mb-6">
                        {['pending', 'bought', 'sold'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full capitalize ${
                                    activeTab === tab
                                        ? 'bg-[#219EBC] text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                {tab} Orders
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center p-4">Loading...</div>
                    ) : orders[activeTab].length === 0 ? (
                        <div className="text-center p-4">No orders found in {activeTab} tab</div>
                    ) : (
                        <div className="space-y-4">
                            {orders[activeTab].map(order => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    type={activeTab}
                                    onGenerateOTP={handleGenerateOTP}
                                    onVerifyOTP={handleVerifyOTP}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;