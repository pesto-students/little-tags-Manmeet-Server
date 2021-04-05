const fetch = require("node-fetch");
const config = require("config");
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

const orderUsers = async (token) => {
  try {
    const productURI = URL + "api/v1/orders/orderUsers";
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
    const orders = await getAllOrders(token);
    let mostOrderedProducts = await mostOrdered(token);
    let orderUsersByDate = await orderUsers(token);
    // todo
    // display top 5 mostOrderedProducts in table
    res.render(
      "orders",
      ((message = ""),
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
