const fetch = require("node-fetch");
const config = require("config");
const { orderUsersByYearly } = require("../controllers/orderController");
const { compareSync } = require("bcrypt");
const URL = process.env.URL || config.get("URL");
const getAllOrders = async (token) => {
  try {
    const productURI = URL + "api/v1/orders";
    return await fetch(`${productURI}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        return res;
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

const mostOrdered = async (token) => {
  try {
    console.log(token);
    const productURI = URL + "api/v1/orders/mostOrdered";
    return await fetch(`${productURI}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        return res;
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

const orderUsersByDay = async (token) => {
  try {
    const productURI = URL + "api/v1/orders/orderUsers/day";
    return await fetch(`${productURI}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        return res;
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

const orderUsersByMonth = async (token) => {
  try {
    const productURI = URL + "api/v1/orders/orderUsers/month";
    return await fetch(`${productURI}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        return res;
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

const orderUsersByYear = async (token) => {
  try {
    const productURI = URL + "api/v1/orders/orderUsers/year";
    return await fetch(`${productURI}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        return res;
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

exports.orderDashboard = async (req, res) => {
  try {
    const { token } = req.cookies;
    console.log(token);
    const orders = await getAllOrders(token);
    let mostOrderedProducts = await mostOrdered(token);
    let orderUsers_Day = await orderUsersByDay(token);
    let orderUsers_Month = await orderUsersByMonth(token);
    let orderUser_Year = await orderUsersByYear(token);
    // display all the data for the user
    console.log(
      mostOrderedProducts,
      orderUsers_Day,
      orderUsers_Month,
      orderUser_Year
    );
    // todo
    // display top 5 mostOrderedProducts in table
    res.render(
      "orders",
      ((message = ""),
      (mm = mostOrderedProducts),
      (items = orders),
      (pageName = {
        pageName: "Orders",
      }))
    );
  } catch (err) {
    // display error page
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
};
