const Product = require("../models/Product");

// @desc  Get all products with search, filter, pagination
// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.featured === "true") {
      query.isFeatured = true;
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === "price_asc") sort = { price: 1 };
    if (req.query.sort === "price_desc") sort = { price: -1 };
    if (req.query.sort === "rating") sort = { rating: -1 };
    if (req.query.sort === "newest") sort = { createdAt: -1 };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("reviews.user", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc  Create a product
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, stock, brand, isFeatured } = req.body;

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice: discountPrice || 0,
      category,
      stock,
      brand,
      images,
      isFeatured: isFeatured === "true" || isFeatured === true,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc  Update a product
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, description, price, discountPrice, category, stock, brand, isFeatured, keepImages } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.brand = brand ?? product.brand;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === "true" || isFeatured === true;

    let existingImages = [];
    if (keepImages) {
      existingImages = Array.isArray(keepImages) ? keepImages : [keepImages];
    }
    const newImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    if (existingImages.length > 0 || newImages.length > 0) {
      product.images = [...existingImages, ...newImages];
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};

// @desc  Add a review
// @route POST /api/products/:id/reviews
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
