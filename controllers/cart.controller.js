const Cart = require("../models/cart.model.js");

const viewCart = async (req, res) => {
  try {
    // find cart belonging to user and add products from db
    const cart = await Cart.findOne({ userId: req.user.id }).populate("products");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ status: "ok", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItemCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });
    } else {
      // try to find product in user's cart
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (productIndex > -1) {
        // if there, add quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // if not there, add it
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(201).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItemCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productId = req.body.productId;
    const initialLength = cart.products.length;
    cart.products = cart.products.filter(product => product.productId.toString() !== productId);

    if (cart.products.length === initialLength) {
      return res.status(400).json({ message: "Product not in cart" });
    }

    res.status(200).send({ status: "ok", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  viewCart,
  addItemCart,
  deleteItemCart,
};
