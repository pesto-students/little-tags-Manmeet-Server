const express = require("express");

const app = express();

const config = require("config");

const port = process.env.PORT || config.get("port");

app.get("/__test", (req, res) => {
  res.send("Hello World");
});

app.use(express.json());

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;
