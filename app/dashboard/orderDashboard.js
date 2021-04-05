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

exports.orderDashboard = async (req, res) => {
  try {
    const { token } = req.cookies;
    let orders = await getAllOrders(token);
    console.log(orders);
    res.render(
      "orders",
      ((message = ""),
      (items = orders),
      (pageName = {
        pageName: "orders",
      }))
    );
  } catch (error) {
    // display error page
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
};
