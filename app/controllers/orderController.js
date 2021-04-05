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
    const orderDate = new Date();
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

const compare = (a, b) => {
  if (a.total < b.total) {
    return 1;
  }
  return -1;
};

exports.mostOrdered = async (req, res) => {
  try {
    const highFrequencyOrders = Order.aggregate([
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $group: {
          _id: "$orderItems.productId",
          total: { $sum: "$orderItems.quantity" },
        },
      },
      {
        $sort: { sum: -1 },
      },
    ]);
    if (!highFrequencyOrders) {
      return res
        .status(404)
        .json({ status: false, full_messages: "No data found" });
    }
    let mostOrders = [];
    for await (const order of highFrequencyOrders) {
      mostOrders = [...mostOrders, order];
    }
    mostOrders.sort(compare);
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }

    res.status(202).json(mostOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

exports.orderUsersDay = async (req, res) => {
  try {
    Order.aggregate(
      [
        {
          $project: {
            _id: "$_userId",
            orderDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$orderDate" },
            },
            day: {
              $dayOfMonth: "$orderDate",
            },
          },
        },
        {
          $match: {
            day: new Date().getDate(),
          },
        },
        {
          $count: "DayUsers",
        },
      ],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(404).json({ status: false, full_messages: err });
        } else {
          res.status(202).json(data);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

exports.orderUsersByMonthly = async (req, res) => {
  try {
    Order.aggregate(
      [
        {
          $project: {
            _id: "$_userId",
            orderDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$orderDate" },
            },
            month: {
              $month: "$orderDate",
            },
          },
        },
        {
          $match: {
            month: new Date().getMonth() + 1,
          },
        },
        {
          $count: "MonthlyUsers",
        },
      ],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(404).json({ status: false, full_messages: err });
        } else {
          res.status(202).json(data);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

exports.orderUsersByYearly = async (req, res) => {
  try {
    Order.aggregate(
      [
        {
          $project: {
            _id: "$_userId",
            orderDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$orderDate" },
            },
            year: {
              $year: "$orderDate",
            },
          },
        },
        {
          $match: {
            year: new Date().getFullYear(),
          },
        },
        {
          $count: "YearlyUsers",
        },
      ],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(404).json({ status: false, full_messages: err });
        } else {
          res.status(202).json(data);
        }
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};
