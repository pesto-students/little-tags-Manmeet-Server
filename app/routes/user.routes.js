const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users.controller");

router.post("/register", UsersController.register);

module.exports = router;
