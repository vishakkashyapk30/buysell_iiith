import express from 'express';
import { createItem, getItem, searchItems } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';
import { deleteItem } from '../controllers/itemController.js';

const router = express.Router();

router.post('/create', protect, createItem);
router.get('/search', protect, searchItems);  // Added protect middleware
router.get('/:id', getItem);
router.delete('/:id', protect, deleteItem);

export default router;