import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { OrderServices } from '../services/OrderServices';
import Navbar from '../components/Navbar';
import DeliveryCard from '../components/DeliveryCard';

const DeliveryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchPendingDeliveries = async () => {
        try {
            const result = await OrderServices.getPendingDeliveries();
            if (result.success) {
                setOrders(result.orders.filter(order => 
                    order.status !== 'completed' && 
                    order.buyerId._id !== user._id
                ));
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSuccess = async (orderId) => {
        await fetchPendingDeliveries();
    };

    useEffect(() => {
        fetchPendingDeliveries();
    }, []);

    return (
        <div className="fixed inset-0 overflow-auto bg-[#8BDAFF]">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-[15px] p-8">
                    <h1 className="text-[32px] font-bold text-[#023047] mb-8">
                        Pending Deliveries
                    </h1>

                    {loading ? (
                        <div className="text-center text-gray-600">Loading...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center text-gray-600">No pending deliveries</div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <DeliveryCard
                                    key={order._id}
                                    order={order}
                                    onVerificationSuccess={handleVerificationSuccess}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryPage;