const fetch = require("node-fetch");
const config = require("config");
const { orderUsersByYearly } = require("../controllers/orderController");
const { compareSync } = require("bcrypt");
const URL = process.env.URL || config.get("URL");
// const URL = "https://shopkart-backend.herokuapp.com/";
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

exports.orderSummery = async (req, res) => {
  try {
    const { token } = req.cookies;
    const productURI = URL + "api/v1/orders/orderSummery/" + req.params.id;
    const result = await fetch(`${productURI}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then((res) => {
        return res;
      });
    console.log(result);
    res.render(
      "orderSummery",
      ((message = ""),
      (orderSummery = result),
      (pageName = {
        pageName: "Orders",
      }))
    );
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
    // console.log(
    //   mostOrderedProducts,
    //   orderUsers_Day,
    //   orderUsers_Month,
    //   orderUser_Year
    // );
    // todo
    // display top 5 mostOrderedProducts in table
    // TODO: get ony single number in response instead of
    // { DayUsers: 6 } ] [ { MonthlyUsers: 8 } ] [ { YearlyUsers: 8 }
    // get 6,8,8 for order by time
    const full = orderUser_Year[0].YearlyUsers;
    const orderBy = [
      {
        category: "Daily",
        value: orderUsers_Day[0] ? orderUsers_Day[0].DayUsers : 0,
        full: full,
      },
      {
        category: "Monthly",
        value: orderUsers_Month[0].MonthlyUsers,
        full: full,
      },
      {
        category: "Yearly",
        value: orderUser_Year[0].YearlyUsers,
        full: full,
      },
    ];

    var result = mostOrderedProducts.map((person) => ({
      _id: person._id.replace("'", "").substring(0, 15),
      total: person.total,
    }));
    console.log(result);
    res.render(
      "orders",
      ((message = ""),
      (mm = result),
      (orderByTime = orderBy),
      (items = orders.reverse()),
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
