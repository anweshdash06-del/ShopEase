const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc  Get dashboard stats
// @route GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select("name stock")
      .limit(10);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      statusCounts,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get all users
// @route GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc  Block/unblock user
// @route PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, isBlocked: user.isBlocked });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getUsers, toggleBlockUser };
