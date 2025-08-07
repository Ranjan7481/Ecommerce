const mongoose = require("mongoose");
const validator = require("validator");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer",
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  }
});

module.exports = mongoose.model("OrderItem", orderItemSchema);