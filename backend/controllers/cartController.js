import Cart from "../models/cartModel.js";
import Item from "../models/itemModel.js";

export const addToCart = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;

    // Debug log
    console.log("Adding to cart:", { itemId, quantity, userId: req.user._id });

    // Validate item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check if user is trying to add their own item
    if (item.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot add your own item to cart",
      });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [{ itemId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.itemId.toString() === itemId
      );

      if (existingItem) {
        existingItem.quantity += parseInt(quantity);
      } else {
        cart.items.push({ itemId, quantity });
      }
      await cart.save();
    }

    // Populate cart
    await cart.populate({
      path: "items.itemId",
      select: "name price image sellerId",
    });

    res.status(200).json({
      success: true,
      cart: cart.toObject(),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding item to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.itemId",
      select: "name price image sellerId",
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [] },
      });
    }

    // Filter out invalid items and transform image URLs
    const validItems = cart.items.filter((item) => item.itemId);
    const transformedCart = {
      ...cart.toObject(),
      items: validItems.map((item) => ({
        ...item.toObject(),
        itemId: {
          ...item.itemId.toObject(),
          image: item.itemId.image
            ? {
                url: item.itemId.image.url,
                public_id: item.itemId.image.public_id,
              }
            : null,
        },
      })),
    };

    res.status(200).json({ success: true, cart: transformedCart });
  } catch (error) {
    console.error("Cart fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.itemId.toString() !== req.params.itemId
        );
        await cart.save();

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};