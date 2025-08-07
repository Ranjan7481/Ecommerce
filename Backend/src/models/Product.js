const mongoose = require("mongoose");



const ProductSchema = new mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 500,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    productPhoto:{

      type:String,
    },

    category: {
      type: String,
      enum: ["furniture", "handbag", "books", "tech", "sneakers", "travel"],
      required: true,
    },
    isBestDeal: {
      type: Boolean,
      default: false,
    },
    isWeeklyPopular: {
      type: Boolean,
      default: false,
    },
    isMostSelling: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
