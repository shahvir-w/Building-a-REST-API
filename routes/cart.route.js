
const express = require("express");
const router = express.Router();
const {
    viewCart,
    addItemCart,
    deleteItemCart,
} = require("../controllers/cart.controller.js");

// get all items in cart
router.get('/', viewCart);

// add an item
router.post('/', addItemCart);

// delete an item
router.delete('/', deleteItemCart);

module.exports = router;
