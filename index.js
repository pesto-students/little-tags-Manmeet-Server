const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const morgan = require("morgan");
const config = require("config");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const shortid = require("shortid");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: config.get("RAZORPAY_KEY_ID"),
  key_secret: config.get("RAZORPAY_SECRET"),
});
/* Start DB Connection */
require("./app/DB/mongoDB.config");
/* Routes */
const userRoute = require("./app/routes/user.routes");
const productRoute = require("./app/routes/product.routes");
const authRoute = require("./app/routes/auth.routes");
const orderRoute = require("./app/routes/order.routes");

/* Dashboard */
const orderDashboard = require("./app/dashboard/orderDashboard");

const { checkAuth } = require("./app/utils/utils");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || config.get("port");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const URL = process.env.URL || config.get("URL");

// Init Middleware
app.use(express.json({ extended: false }));

app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");
app.set("view engine", "ejs");

/* Route Path */
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/orders", orderRoute);

const url = require("url");
/* admin route */
// dashboard

// testing
// product
const getProductData = async (token) => {
  try {
    const productURI = URL + "api/v1/product";
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

const trunkDescription = (products) => {
  products.forEach((product) => {
    product.description =
      product.description.length > 30
        ? product.description.substr(0, 31).concat("...")
        : product.description;
  });
  return products;
};
/* Home Page */
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
app.get("/", async (req, res) => {
  try {
    const authURI = URL + "api/v1/auth";
    // check login auth for token
    const { token } = req.cookies;
    if (token) {
      await fetch(`${authURI}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      const orders = await getAllOrders(token);
      // let WelcomeMessage = "";
      res.render(
        "dashboard",
        ((message = "Welcome to shopKart"),
        (items = orders.reverse()),
        (pageName = {
          pageName: "Dashboard",
        }))
      );
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    // Todo
    // Display error message
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

// render login
app.get("/login", (req, res) => {
  res.render("login", { layout: "./layouts/loginLayout" });
});

// register
app.post("/login", async (req, res, next) => {
  try {
    const authURI = URL + "api/v1/auth";
    const fetchResult = await fetch(`${authURI}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
      method: "post",
    });
    const { token } = await fetchResult.json();

    if (!token) {
      // Todo
      // Display error message
      return res.render("/login", { layout: "./layouts/loginLayout" });
    }
    // setCookie
    res.cookie("token", token);

    res.redirect(
      url.format({
        pathname: "/",
        query: {
          loggedIn: true,
        },
      })
    );
  } catch (err) {
    // Todo
    // Display error message
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

// get all products
app.get("/product", async (req, res) => {
  try {
    const { token } = req.cookies;
    let products = await getProductData(token);
    // products = trunkDescription(products);
    res.render(
      "product",
      ((message = ""),
      (items = products),
      (pageName = {
        pageName: "Product",
      }))
    );
  } catch (err) {
    // Todo
    // Display error message
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

// Add new product
app.post("/product", async (req, res) => {
  try {
    const productURI = URL + "api/v1/product";
    const { token } = req.cookies;
    await fetch(`${productURI}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(req.body),
    })
      .then((r) => r.json())
      .then(async (result) => {
        let products = await getProductData(token);
        // products = trunkDescription(products);
        res.render(
          "product",
          ((message = result.full_messages),
          (items = products),
          (pageName = {
            pageName: "Product",
          }))
        );
      })
      .catch((e) => console.error(e.message));
  } catch (error) {
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

// update a new product
app.put("/product/:id", async (req, res) => {
  try {
    const productURI = URL + "api/v1/product/" + req.params.id;
    const { token } = req.cookies;
    await fetch(`${productURI}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      body: JSON.stringify(req.body),
    })
      .then((r) => r.json())
      .then(async (result) => {
        const products = await getProductData(token);
        res.render(
          "product",
          ((message = result.full_messages),
          (items = products),
          (pageName = {
            pageName: "Product",
          }))
        );
      })
      .catch((e) => console.error(e.message));
  } catch (error) {
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

// delete a product by id
app.delete("/product/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const productURI = URL + "api/v1/product/" + req.params.id;
    const { token } = req.cookies;
    await fetch(`${productURI}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then(async (result) => {
        let products = await getProductData(token);
        // products = trunkDescription(products);
        res.render(
          "product",
          ((message = result.full_messages),
          (items = products),
          (pageName = {
            pageName: "Product",
          }))
        );
      })
      .catch((e) => console.error(e.message));
  } catch (error) {
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

// update product by an id
app.get("/productUpdate/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const productURI = URL + "api/v1/product/" + req.params.id;
    const { token } = req.cookies;
    await fetch(`${productURI}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((r) => r.json())
      .then((result) => {
        res.render(
          "productUpdate",
          ((item = result),
          (message = ""),
          (pageName = {
            pageName: "Product",
          }))
        );
      })
      .catch((e) => console.error(e.message));
  } catch (error) {
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

// orders
app.get("/orders", orderDashboard.orderDashboard);
app.get("/orders/orderSummery/:id", orderDashboard.orderSummery);

// razorpay
app.post("/razorpay", async (req, res) => {
  const payment_capture = 1;
  const amount = req.body.totalPrice;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
