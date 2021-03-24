const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users.controller");

const { registerValidator } = require("../utils/utils");

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */
router.post("/", registerValidator(), UsersController.register);

module.exports = router;
