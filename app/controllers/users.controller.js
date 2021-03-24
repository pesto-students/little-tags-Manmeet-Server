const User = require("../models/user.model");
const utils = require("../utils/utils.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ status: false, full_messages: "User doesn't match" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.passwordHash);
      const token = await userLogin.generateAuthToken();
      if (!isMatch) {
        res
          .status(400)
          .json({ status: false, full_messages: "Invalid Credentials" });
      } else {
        res
          .status(202)
          .cookie("access_token", "Bearer " + token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
          })
          .json({
            success: true,
            full_messages: "User Signed In successfully",
            userName: userLogin.userName,
          });
      }
    } else {
      res
        .status(400)
        .json({ status: false, full_messages: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.register = async function (req, res) {
  const isEmpty = (err) => {
    return [...Object.keys(err)].length === 0;
  };
  // validations

  const errors = {};
  console.log(req.body);
  const { email, password, userName, phoneNumber } = req.body;

  // validate form
  if (!userName || userName.trim() === "")
    errors.userName = "Username is required";

  if (!email || email.trim() === "") errors.email = "Email is required";

  if (!password || password.trim() === "")
    errors.password = "Password must not be empty";

  if (!isEmpty(errors)) {
    return res.status(422).json({ success: false, errors });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      errors.email = "Email: " + email + " is already taken";
      if (!isEmpty(errors)) {
        return res.status(422).json({ success: false, errors });
      }
    }
    const randomSalt = utils.saltGenerator();
    const passwordHash = utils.passwordGenerator(password, randomSalt);

    const user = new User({
      email,
      userName,
      phoneNumber,
      randomSalt,
      passwordHash,
    });

    await user.save();
    res
      .status(201)
      .json({ success: true, full_messages: "User registered Successfully" });
  } catch (err) {
    console.log(err);
  }
};
