const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const auth = require("../middleWare/auth");

const {
  loginValidation,
  saltGenerator,
  passwordGenerator,
} = require("../utils/utils");

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   POST api/auth
 * @desc    Authenticate User and get token
 * @access  Public
 */
router.post("/", loginValidation(), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, full_messages: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      return res
        .status(400)
        .json({ status: false, full_messages: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, userLogin.passwordHash);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, full_messages: "Invalid Credentials" });
    }
    const user = new User();
    const token = await user.generateAuthToken();
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
