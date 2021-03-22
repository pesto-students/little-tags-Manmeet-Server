const User = require("../models/user.model");
const bcrypt = require("bcrypt");
exports.register = function (req, res, next) {
  const isEmpty = (err) => {
    return [...Object.keys(err)].length === 0;
  };

  const saltGenerator = () => {
    const saltRounds = Math.floor(Math.random() * 10 + 1);
    const salt = bcrypt.genSaltSync(saltRounds);
    return salt;
  };

  const passwordGenerator = (candidatePassword, salt) => {
    const passwordHash = bcrypt.hashSync(candidatePassword, salt);
    return passwordHash;
  };
  // validations

  const errors = {};
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;
  const phoneNumber = req.body.phoneNumber;

  // validate form
  if (!userName || userName.trim() === "")
    errors.userName = "Username is required";

  if (!email || email.trim() === "") errors.email = "Email is required";

  if (!password || password.trim() === "")
    errors.password = "Password must not be empty";

  if (!isEmpty(errors)) {
    return res.status(422).json({ success: false, errors });
  }
  // return res.send("success");
  return User.findOne({
    email: { $eq: email },
    function(err, obj) {
      if (obj) {
        errors.email = "Email id don";
      }
    },
  })
    .then((user) => {
      if (user !== null) {
        // If the user exists, return Error
        if (user.email === email)
          errors.email = "Email: " + email + " is already taken";

        if (!isEmpty(errors)) {
          return res.status(403).json({ success: false, errors });
        }
      }
      // const method = new User().methods;
      const randomSalt = saltGenerator();
      const passwordHash = passwordGenerator(password, randomSalt);
      user = new User({
        email: email,
        userName: userName,
        randomSalt: randomSalt,
        passwordHash: passwordHash,
        phoneNumber: phoneNumber,
      });
      console.log(user);
      user
        .save()
        .then((user) => {
          if (user) {
            console.dir(user);
            console.log(user.toJSON());
            res.json({
              success: true,
              full_messages: "User registered Successfully",
            });
          } else {
            console.log("user is empty ...???");
            res.json({ success: true, full_messages: "something went wrong" });
          }
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        full_messages: err,
      });
    });
};
