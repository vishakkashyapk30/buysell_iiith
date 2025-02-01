import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../axios';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
// import { FaTrash } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    age: user?.age || '',
    contactNumber: user?.contactNumber || '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        age: user.age || '',
        contactNumber: user.contactNumber || '',
        password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        console.log('Fetching user items...');
        const response = await axios.get('/api/user/items');
        console.log('Items response:', response.data);

        if (response.data.success) {
          setItems(response.data.items);
        } else {
          setError('Failed to fetch items');
        }
      } catch (error) {
        console.error('Error fetching items:', error.response?.data || error);
        setError('Error loading items');
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await axios.put('/api/user/profile', updateData);

      if (response.data.success) {
        setIsEditing(false);
        await login(localStorage.getItem('token'));
        setSuccessMessage('Profile updated successfully!');
        setError('');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Update error:', error);
      setError(error.response?.data?.message || 'Update failed');
      setSuccessMessage('');
    }
  };

  const renderField = (label, name, type = 'text') => (
    <div className="mb-4 w-full">
      <label className="block text-[#000000] opacity-80 mb-2">{label}</label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full p-4 bg-[#EFF2F3] rounded-lg text-black"
        />
      ) : (
        <p className="w-full p-4 bg-[#EFF2F3] rounded-lg text-black">
          {name === 'password' ? '********' : formData[name]}
        </p>
      )}
    </div>
  );

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await axios.delete(`/api/items/${itemId}`);
        if (response.data.success) {
          setItems(items.filter(item => item._id !== itemId));
        }
      } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete item');
      }
    }
  };

  return (
    <div className="fixed inset-0 overflow-auto bg-[#8BDAFF] flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#023047]">User Profile</h1>
            <button
              type="button"
              onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
              className="bg-[#219EBC] text-white px-6 py-2 rounded-full hover:bg-[#E56F2E] transition-colors"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 mb-4 font-semibold">{successMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {renderField('First Name', 'firstName')}
              {renderField('Email', 'email', 'email')}
              {renderField('Contact Number', 'contactNumber', 'tel')}
            </div>
            <div>
              {renderField('Last Name', 'lastName')}
              {renderField('Age', 'age', 'number')}
              {isEditing && renderField('New Password', 'password', 'password')}
            </div>
          </form>
        </div>

        {/* Items Section */}
        <div className="rounded-xl p-8">
          <h2 className="text-2xl font-bold text-[#023047] mb-6">My Listed Items</h2>
          {loading ? (
            <div className="text-center text-gray-600">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-600">No items listed yet</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map(item => (
                <div key={item._id} className="transform scale-90">
                  <ItemCard
                    item={item}
                    disableClick={true}
                    showDeleteButton={true}
                    onDelete={handleDeleteItem}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;