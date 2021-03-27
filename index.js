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

const port = process.env.PORT || config.get("port");

// Init Middleware
app.use(express.json({ extended: false }));

app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));

// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");
app.set("view engine", "ejs");

/* Route Path */
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);

const url = require("url");
const products = require("./app/controllers/product.controller");
/* admin route */
app.get("/", async (req, res) => {
  // for testing purpose only
  if (true) {
    let products = await fetch("http://localhost:4000/api/v1/product")
      .then((r) => r.json())
      .then((res) => {
        return res;
      });
    res.render(
      "dashboard",
      ((message = "Welcome to shopcart"),
      (items = products),
      (pageName = {
        pageName: "Dashboard",
      }))
    );
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login", { layout: "./layouts/loginLayout" });
});
app.post("/login", (req, res, next) => {
  console.log(req.body);
  res.redirect(
    url.format({
      pathname: "/",
      query: {
        loggedIn: true,
      },
    })
  );
});
app.get("/product", async (req, res) => {
  let products = await fetch("http://localhost:4000/api/v1/product")
    .then((r) => r.json())
    .then((res) => {
      return res;
    });
  res.render(
    "product",
    ((message = ""),
    (items = products),
    (pageName = {
      pageName: "Product",
    }))
  );
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
