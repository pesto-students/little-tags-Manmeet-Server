const express = require("express");
const app = express();
const morgan = require("morgan");
const config = require("config");
const createError = require("http-errors");
const path = require("path");
const cors = require("cors");
require("./app/DB/mongoDB.config");

const userRoute = require("./app/routes/user.routes");

const port = process.env.PORT || config.get("port");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(userRoute);

// const middleware = (req, res, next) => {
//   console.log(`Hello my Middleware`);
//   next();
// };

app.get("/", (req, res) => {
  res.send("Welcome to ShopKart");
});

// app.get("/about", middleware, (req, res) => {
//   console.log(`Hello my About`);
//   res.send(`Hello About world from the server`);
// });

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
