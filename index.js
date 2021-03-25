const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const morgan = require("morgan");
const config = require("config");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");

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

/* home route */
app.get("/", (req, res) => {
  res.render("dashboard", (message = { login: "login" }));
});
app.get("/login", (req, res) => {
  res.render("login", { layout: "./layouts/loginLayout" });
});
app.get("/product", (req, res) => {
  res.render("product");
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
