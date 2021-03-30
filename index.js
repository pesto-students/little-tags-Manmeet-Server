const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const morgan = require("morgan");
const config = require("config");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
/* Start DB Connection */
require("./app/DB/mongoDB.config");

/* Routes */
const userRoute = require("./app/routes/user.routes");
const productRoute = require("./app/routes/product.routes");
const authRoute = require("./app/routes/auth.routes");
const { checkAuth } = require("./app/utils/utils");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || config.get("port");

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

const url = require("url");
/* admin route */
// dashboard

// testing
// product
const getProductData = async (token) => {
  return await fetch("http://localhost:4000/api/v1/product", {
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
  })
    .then((r) => r.json())
    .then((res) => {
      return res;
    });
};

app.get("/", async (req, res) => {
  try {
    // check login auth for token
    const { token } = req.cookies;
    if (token) {
      const dataResponse = await fetch("http://localhost:4000/api/v1/auth", {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      const value = await dataResponse.json();

      const products = await getProductData(token);
      res.render(
        "dashboard",
        ((message = "Welcome to shopKart"),
        (items = products),
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

//
app.post("/login", async (req, res, next) => {
  try {
    const fetchResult = await fetch("http://localhost:4000/api/v1/auth", {
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

app.get("/product", async (req, res) => {
  try {
    const { token } = req.cookies;
    const products = await getProductData(token);
    res.render(
      "product",
      ((message = ""),
      (items = products),
      (pageName = {
        pageName: "Product",
      }))
    );
  } catch (error) {
    // Todo
    // Display error message
    console.error(err.message);
    res.render("login", { layout: "./layouts/loginLayout" });
  }
});

app.post("/product", async (req, res) => {
  try {
    const { token } = req.cookies;
    await fetch("http://localhost:4000/api/v1/product", {
      method: "post",
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

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
