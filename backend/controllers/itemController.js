import Item from '../models/itemModel.js';
import { cloudinary } from '../config/cloudinary.js';

export const createItem = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const image = req.files?.image;

        if (!name || !price || !description || !category || !image) {
            return res.status(400).json({
                success: false,
                message: 'All fields including image are required'
            });
        }

        if (!image.mimetype.startsWith('image')) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file'
            });
        }

        try {
            console.log('Uploading to cloudinary...', image.tempFilePath);
            
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: 'items',
                width: 300,
                crop: "scale"
            });

            console.log('Cloudinary upload successful');
            console.log('Image URL:', result.secure_url);
            console.log('Public ID:', result.public_id);

            const item = await Item.create({
                name,
                price: Number(price),
                description,
                category,
                image: {
                    public_id: result.public_id,
                    url: result.secure_url
                },
                sellerId: req.user._id
            });

            console.log('Item created:', item);

            res.status(201).json({
                success: true,
                item,
                imageUrl: result.secure_url // Add image URL to response
            });
        } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            return res.status(400).json({
                success: false,
                message: 'Image upload failed'
            });
        }
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating item'
        });
    }
};

// Add test endpoint to get image URL
export const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('sellerId', 'firstName lastName contactNumber');
        
        if (!item) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }
        
        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export const searchItems = async (req, res) => {
    try {
        const { search, categories, userId } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (categories) {
            const categoryArray = categories.split(',');
            query.category = { $in: categoryArray };
        }

        // Exclude items where seller is the current user
        if (userId) {
            query.sellerId = { $ne: userId };
        }

        const items = await Item.find(query)
            .populate('sellerId', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            items
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error searching items'
        });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Check if user is the seller
        if (item.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this item'
            });
        }

        // Delete image from cloudinary
        await cloudinary.uploader.destroy(item.image.public_id);
        
        // Delete item from database
        await Item.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};