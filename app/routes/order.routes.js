const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// const adminAuth = require("../middleWare/adminAuth");
const auth = require("../middleWare/auth");

/**
 * @route   POST api/v1/orders
 * @desc    create a new order
 * @access  Private
 */
router.post("/", auth, orderController.addOrderItems);

/**
 * @route   GET api/v1/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get("/", auth, orderController.getOrders);

/**
 * @route   GET api/v1/orders/myOrders
 * @desc    Get all orders to specific user
 * @access  Private/Admin
 */
router.get("/myOrders", auth, orderController.getMyOrders);

module.exports = router;
