const Order = require("../models/Order.model");
const { checkAdminRights } = require("../utils/utils");

// create a new Order
exports.addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      shippingPrice,
    } = req.body;
    const orderDate = new Date().toString().substr(4, 11);
    const createdOrder = new Order({
      _userId: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      orderDate,
    });
    // const order = createdOrder.save();
    // res.status(201).json({ order });
    await createdOrder
      .save()
      .then(() =>
        res.status(201).json({ status: true, full_messages: "Order Created!" })
      )
      .catch((err) =>
        res.status(500).json({ status: false, full_messages: "Server Error" })
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user });
  res.json(orders);
};

// get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders) {
      return res
        .status(404)
        .json({ status: false, full_messages: "No data found" });
    }
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }
    res.status(202).json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};
