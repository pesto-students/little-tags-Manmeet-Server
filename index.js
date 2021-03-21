const express = require("express");
const app = express();
const morgan = require("morgan");
const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");
const createError = require("http-errors");
// const connectDB = require("./config/mongodb.config");
const db = process.env.MONGODB_URI || config.get("MONGODB_URI");
const port = process.env.PORT || config.get("port");

const usersRouter = require("./app/routes/user.routes");

app.use(express.json());
app.use(morgan("tiny"));

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    // winston.info("Connected to Mongoose !!!");
  } catch (error) {
    winston.error(error.message, error);
    process.exit(1);
  }
};
connectDB();

app.use("/api", usersRouter);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
