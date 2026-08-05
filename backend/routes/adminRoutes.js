const express = require("express");
const router = express.Router();
const { getDashboardStats, getUsers, toggleBlockUser } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/stats", protect, admin, getDashboardStats);
router.get("/users", protect, admin, getUsers);
router.put("/users/:id/block", protect, admin, toggleBlockUser);

module.exports = router;
