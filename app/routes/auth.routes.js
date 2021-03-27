const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const auth = require("../middleWare/auth");

const { loginValidation } = require("../utils/utils");
const UsersController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
/**
 * @route   GET api/v1/auth
 * @desc    Get user details by token
 * @access  Private
 */
router.get("/", auth, authController.auth);

/**
 * @route   POST api/v1/auth
 * @desc    Authenticate User and get token
 * @access  Public
 */
router.post("/", loginValidation(), authController.login);

module.exports = router;
