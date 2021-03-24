const express = require("express");
const router = express.Router();

const {
  registerValidator,
  saltGenerator,
  passwordGenerator,
} = require("../utils/utils");
const User = require("../models/user.model");

const { validationResult } = require("express-validator");

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */

router.post("/", registerValidator(), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: false, full_messages: errors.array() });
  }

  const { email, userName, password, phoneNumber } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(422).json({
        status: false,
        errors: [{ full_messages: "User already exist" }],
      });
    }
    const randomSalt = saltGenerator();
    const passwordHash = passwordGenerator(password, randomSalt);

    const user = new User({
      email,
      userName,
      phoneNumber,
      randomSalt,
      passwordHash,
    });
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
