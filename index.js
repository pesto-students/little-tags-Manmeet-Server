const express = require("express");
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
app.set("view engine", "ejs"); // set up ejs for templating

/* Route Path */
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/product", productRoute);

/* home route */
app.get("/", (req, res) => {
  res.render("login.ejs", (message = { login: "login" }));
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
