const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

exports.saltGenerator = function () {
  const saltRounds = Math.floor(Math.random() * 10 + 1);
  const salt = bcrypt.genSaltSync(saltRounds);
  return salt;
};

exports.passwordGenerator = function (candidatePassword, salt) {
  const passwordHash = bcrypt.hashSync(candidatePassword, salt);
  return passwordHash;
};

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

exports.loginValidation = () => {
  return [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").exists(),
  ];
};
