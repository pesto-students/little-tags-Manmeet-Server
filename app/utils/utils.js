const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const config = require("config");
const User = require("../models/user.model");
exports.saltGenerator = function () {
  const saltRounds = config.get("SALT_ROUND");
  const salt = bcrypt.genSaltSync(saltRounds);
  return salt;
};

exports.passwordGenerator = function (candidatePassword, salt) {
  const passwordHash = bcrypt.hashSync(candidatePassword, salt);
  return passwordHash;
};

/* New User Validation */
exports.registerValidator = () => {
  return [
    check("userName", "User Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check(
      "password",
      "Please enter password with minimum 8 characters"
    ).isLength({ min: 8 }),
    check("phoneNumber", "Min PhoneNumber length should be 10")
      .isLength({ min: 10 })
      .notEmpty()
      .withMessage("Phone number is required")
      .not()
      .custom((val) =>
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(val)
      )
      .withMessage("Please enter correct phone number"),
  ];
};

/* Existing User Validation */
exports.loginValidation = () => {
  return [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ];
};

exports.checkAdminRights = async (user) => {
  const userData = await User.findById(user);
  const { role } = userData;
  if (role === "Normal") return false;
  return true;
};

exports.checkAuth = (req, res) => {
  console.log(req.cookies);
};
