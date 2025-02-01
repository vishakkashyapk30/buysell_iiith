import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import axios from '../axios';
import Navbar from '../components/Navbar';

const SellPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
        multiple: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            if (!image) {
                throw new Error('Please select an image');
            }
            formDataToSend.append('image', image);

            console.log('Sending data:', Object.fromEntries(formDataToSend));

            const response = await axios.post('/api/items/create', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setSuccessMessage('Item listed successfully!');
                setFormData({ name: '', price: '', description: '', category: '' });
                setImage(null);
                setImagePreview(null);
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || error.message || 'Failed to list item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#8BDAFF] flex flex-col overflow-auto">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl p-8 h-auto min-h-[400px]">
                    <h1 className="text-3xl font-bold text-[#023047] mb-8">Sell Item</h1>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {successMessage && <p className="text-green-500 mb-4 font-semibold">{successMessage}</p>}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Rest of the form remains the same */}
                        <div>
                            <label className="block text-black opacity-80 mb-2">Item Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-[#EFF2F3] rounded-lg text-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-black opacity-80 mb-2">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-3 bg-[#EFF2F3] rounded-lg text-black"
                                required
                            />
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-black opacity-80 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full p-2 bg-[#EFF2F3] rounded-lg text-black h-[48px]"
                                required
                            >
                                <option value="">Select category</option>
                                <option value="clothing">Clothing</option>
                                <option value="electronics">Electronics</option>
                                <option value="books">Books</option>
                                <option value="furniture">Furniture</option>
                                <option value="grocery">Grocery</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-black opacity-80 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-3 bg-[#EFF2F3] rounded-lg h-32 resize-none text-black"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-black opacity-80 mb-2">Image Upload</label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed border-[#023047] rounded-lg p-8 text-center cursor-pointer
                                ${isDragActive ? 'border-blue-500 bg-blue-50' : ''}`}
                            >
                                <input {...getInputProps()} />
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto" />
                                ) : (
                                    <p className="text-black">Drag and drop an image here, or click to select</p>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#219EBC] text-white px-6 py-2 rounded-full hover:bg-[#E56F2E] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Listing...' : 'List Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellPage;