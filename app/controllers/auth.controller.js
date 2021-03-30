const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

/* Existing user Login Controller */
exports.login = async (req, res) => {
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
      // console.log("Not loggedIn");
      return res
        .status(401)
        .json({ status: false, full_messages: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, userLogin.passwordHash);

    if (!isMatch) {
      // console.log("Password Incorrect");
      return res
        .status(401)
        .json({ status: false, full_messages: "Invalid Credentials" });
    }
    const token = await userLogin.generateAuthToken();
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/* auth Layer controller */
exports.auth = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const {
      userName,
      email,
      phoneNumber,
      isGuest,
      isThirdPartyAuth,
      dateCreated,
    } = user;
    res
      .status(201)
      .json({ userName, email, phoneNumber, isGuest, isThirdPartyAuth });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
