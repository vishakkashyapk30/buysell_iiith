import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';

const SearchPage = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
        }, 500),
        []
    );

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            
            if (searchQuery.trim()) {
                params.append('search', searchQuery);
            }
            
            if (selectedCategories.length > 0) {
                params.append('categories', selectedCategories.join(','));
            }

            // Add current user ID to filter out own items
            if (user?._id) {
                params.append('userId', user._id);
            }

            const response = await axios.get(`/api/items/search?${params}`);
            setItems(response.data.items);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to fetch items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [searchQuery, selectedCategories]);

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <div className="fixed inset-0 overflow-auto bg-[#8BDAFF]">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Header and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-[#023047]">Buy Items</h1>
                    
                    <div className="relative w-full md:w-[547px]">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            onChange={handleSearchChange}
                            className="w-full h-12 pl-12 pr-4 rounded-full bg-[#F0F0F0] text-black"
                        />
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Category Filters */}
                <CategoryFilter 
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                />

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Items Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#023047]"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center text-[#023047] text-xl">
                        No items found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map(item => (
                            <ItemCard 
                                key={item._id} 
                                item={item}
                                onClick={() => navigate(`/item/${item._id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;