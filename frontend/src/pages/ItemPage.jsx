import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import Navbar from '../components/Navbar';
import AddToCartButton from '../components/AddToCartButton';

const ItemPage = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`/api/items/${id}`);
                console.log('Item data:', response.data.item);
                setItem(response.data.item);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!item) return <div>Item not found</div>;

    return (
        <div className="fixed inset-0 overflow-auto bg-[#8BDAFF]">
            <Navbar />
            <div className="container mx-auto px-4 py-2">
                <div className="bg-white rounded-[15px] p-6 w-[1135px] mx-auto mt-[29px] relative">
                    <div className="absolute top-6 right-6 w-[200px]">
                        <AddToCartButton itemId={item._id} />
                    </div>

                    <h1 className="text-[32px] font-bold text-[#023047] mb-8 pl-[22px]">
                        Item Details
                    </h1>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-5">
                            <div className="mb-6">
                                <label className="text-black opacity-80 font-normal text-base mb-2 block">Name</label>
                                <div className="bg-[#EFF2F3] p-3 rounded-lg opacity-80 text-black">
                                    {item.name}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-black opacity-80 font-normal text-base mb-2 block">Image</label>
                                <img
                                    src={item.image.url}
                                    alt={item.name}
                                    className="w-[520px] h-[364px] object-cover rounded-lg bg-[#EFF2F3]"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="mb-6">
                                <label className="text-black opacity-80 font-normal text-base mb-2 block">Price</label>
                                <div className="bg-[#EFF2F3] p-3 rounded-lg opacity-80 text-black">
                                    ₹{item.price}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-black opacity-80 font-normal text-base mb-2 block">Category</label>
                                <div className="bg-[#EFF2F3] p-3 rounded-lg capitalize opacity-80 text-black">
                                    {item.category}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-black opacity-80 font-normal text-base mb-2 block">Description</label>
                                <div className="bg-[#EFF2F3] p-3 rounded-lg min-h-[100px] opacity-80 text-black">
                                    {item.description}
                                </div>
                            </div>


                            <div className="mb-6">
                                <label className="text-black opacity-80 font-normal text-base mb-2 block">
                                    Seller Name
                                </label>
                                <div className="bg-[#EFF2F3] p-3 rounded-lg opacity-80 min-h-[50px] text-black">
                                    {item.sellerId ?
                                        `${item.sellerId.firstName} ${item.sellerId.lastName}` :
                                        'Not available'
                                    }
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="text-black opacity-80 font-normal text-base mb-2 block">
                                    Seller Contact
                                </label>
                                <div className="bg-[#EFF2F3] p-3 rounded-lg opacity-80 min-h-[50px] text-black">
                                    {item.sellerId?.contactNumber || 'Not available'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add to Cart Button
                <div className="flex justify-center mt-6">
                    <div className="w-[400px]">
                        <AddToCartButton itemId={item._id} />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default ItemPage;