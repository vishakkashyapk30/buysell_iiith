import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,  
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
        await cloudinary.api.ping();
        console.log('Cloudinary connected successfully');
    } catch (error) {
        console.error('Cloudinary connection failed:', error);
    }
};

export const getImageUrl = (publicId) => {
    if (!publicId) return null;
    return cloudinary.url(publicId, {
        secure: true,
        transformation: [
            { width: 300, crop: 'fill' }
        ]
    });
};

export { cloudinary };
export default connectCloudinary;