const Category = require("../models/Category");
const Product = require("../models/Product");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const category = await Category.create({ name, description, image });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.name = req.body.name || category.name;
    category.description = req.body.description ?? category.description;
    if (req.file) category.image = `/uploads/${req.file.filename}`;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const inUse = await Product.findOne({ category: category._id });
    if (inUse) {
      return res.status(400).json({ message: "Cannot delete category with existing products" });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
