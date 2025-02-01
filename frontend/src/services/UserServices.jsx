import axios from '../axios';

export const UserServices = {
    async getUserItems() {
        try {
            const response = await axios.get('/api/user/items');
            return { success: true, items: response.data.items };
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    }
};