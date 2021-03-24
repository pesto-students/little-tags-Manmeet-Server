const morgan = require("morgan");
const config = require("config");
const mongoose = require("mongoose");
const db = process.env.MONGODB_URI || config.get("MONGODB_URI");

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`DB connection successful`);
  })
  .catch((err) => console.log(`no connection`));
