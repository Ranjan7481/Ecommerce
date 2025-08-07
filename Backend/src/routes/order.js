const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Product = require("../models/Product");
const User = require("../models/User"); 
const { userAuth } = require("../middleware/Auth");




// POST /orders - Place Order
// routes/orders.js (your snippet)
router.post("/createOrders", userAuth, async (req, res) => {
  try {
    const { items, customer } = req.body; // ⬅️ include customer
    const userId = req.user._id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required and must be an array." });
    }
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ error: "Customer name, phone and address are required." });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ error: "Product not found." });

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${product.ProductName}` });
      }

      const orderItem = await OrderItem.create({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      orderItems.push(orderItem._id);
      totalAmount += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      },
    });

    // ⚠️ Keep the response shape consistent; frontend expects `order`
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: "Failed to place order", details: err.message });
  }
});

// GET /orders - View Order History
router.get("/orders", userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "items",
        populate: { path: "product" },
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
});

// GET /orders/:id - View Single Order
router.get("/orders/:id", userAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate({
        path: "items",
        populate: { path: "product" },
      });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order", details: err.message });
  }
});

// DELETE /orders/:id - Cancel Order
router.delete("/orders/:id", userAuth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // keep your current rule if needed
    if (order.status !== "pending") {
      return res.status(400).json({ error: "Only pending orders can be deleted" });
    }

    // Delete related OrderItem docs first
    await OrderItem.deleteMany({ _id: { $in: order.items } });

    // Delete the order itself
    await Order.deleteOne({ _id: order._id });

    return res.json({ message: "Order deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete order", details: err.message });
  }
});


module.exports = router;
