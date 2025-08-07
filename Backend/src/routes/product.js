const express = require("express");

const Product = require("../models/Product");
const { userAuth } = require("../middleware/Auth");
const { adminAuth } = require("../middleware/Admin");
const multer = require("multer");

const productRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage }); // correct way

const { validateProductInput , validateProductInputForEdit } = require("../utils/validate");

productRouter.post(
  "/product/add",
  upload.single("productPhoto"),
  userAuth,
  adminAuth,
  async (req, res) => {
    try {
      const {
        ProductName,
        description,
        price,
        stock,
        category,
        isBestDeal,
        isWeeklyPopular,
        isMostSelling,
        isTrending,
      } = req.body;

      const { errors, isValid } = validateProductInput(req.body);

      if (!isValid) {
        return res.status(400).json({ errors });
      }

      const productExists = await Product.findOne({ ProductName });
      if (productExists) {
        return res.status(400).json({ error: "Product already exists" });
      }

      const photobase64 = req.file ? req.file.buffer.toString("base64") : null;

      const newProduct = new Product({
        ProductName,
        description,
        price,
        stock,
        category,
        isBestDeal,
        isWeeklyPopular,
        isMostSelling,
        isTrending,
        productPhoto: photobase64,
      });

      await newProduct.save();
      res
        .status(201)
        .json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// PUT: Update Product
productRouter.put(
  "/product/update/:id",
  upload.single("productPhoto"),
  userAuth,
  adminAuth,
  async (req, res) => {
    try {
      const productId = req.params.id.trim();
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: "Product not found" });

      const {
        ProductName,
        description,
        price,
        stock,
        category,
        isBestDeal,
        isWeeklyPopular,
        isMostSelling,
        isTrending,
      } = req.body;

      // Optional: validate using a utility function
      const { errors, isValid } = validateProductInputForEdit(req.body);
      if (!isValid) return res.status(400).json({ errors });

      if (price && isNaN(price))
        return res.status(400).json({ error: "Price must be a valid number" });
      if (stock && isNaN(stock))
        return res.status(400).json({ error: "Stock must be a valid number" });

      product.ProductName = ProductName?.trim() || product.ProductName;
      product.description = description?.trim() || product.description;
      product.price = price ? Number(price) : product.price;
      product.stock = stock ? Number(stock) : product.stock;
      product.category = category?.trim() || product.category;
      product.isBestDeal = isBestDeal === "true";
      product.isWeeklyPopular = isWeeklyPopular === "true";
      product.isMostSelling = isMostSelling === "true";
      product.isTrending = isTrending === "true";

      // Handle new photo if uploaded
      if (req.file) {
        product.productPhoto = req.file.buffer.toString("base64");
      }

      await product.save();
      res.json({ message: "Product updated successfully", data: product });
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

productRouter.delete(
  "/product/delete/:id",
  userAuth,
  adminAuth,
  async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

productRouter.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

productRouter.get("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id.trim();
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

productRouter.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const products = await Product.find({
      ProductName: { $regex: query, $options: "i" },
    });
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Top categories with some products
productRouter.get("/categories", async (req, res) => {
  try {
    const categories = [
      "furniture",
      "handbag",
      "books",
      "tech",
      "sneakers",
      "travel",
    ];
    const data = {};
    for (let cat of categories) {
      const products = await Product.find({ category: cat }).limit(5);
      data[cat] = products;
    }
    res.json({ message: "Categories fetched", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search within a specific category
// Get all products by category
productRouter.get("/search/category", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const products = await Product.find({
      category: category.toLowerCase().trim(),
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ error: `No products found in category '${category}'` });
    }

    res.json({
      message: `Products in category '${category}' fetched successfully`,
      data: products,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Today's Best Deals
productRouter.get("/best-deals", async (req, res) => {
  try {
    const products = await Product.find({ isBestDeal: true }).limit(10);
    res.json({ message: "Best Deals fetched", data: products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Weekly Popular
productRouter.get("/weekly-popular", async (req, res) => {
  try {
    const products = await Product.find({ isWeeklyPopular: true }).limit(10);
    res.json({ message: "Weekly Popular Products fetched", data: products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Most Selling
productRouter.get("/most-selling", async (req, res) => {
  try {
    const products = await Product.find({ isMostSelling: true }).limit(10);
    res.json({ message: "Most Selling Products fetched", data: products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Trending Products
productRouter.get("/trending", async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(10);
    res.json({ message: "Trending Products fetched", data: products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = productRouter;
