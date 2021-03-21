const User = require("../models/user.model");

exports.register = function (req, res, next) {
  // validations

  const errors = {};
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.username;

  // validate form
  if (!userName || userName.trim() === "")
    errors.userName = "Username is required";

  if (!email || email.trim() === "") errors.email = "Email is required";

  if (!password || password.trim() === "")
    errors.password = "Password must not be empty";

  if (!isEmpty(errors)) {
    return res.status(422).json({ success: false, errors });
  }
  return "success";
  // return User.findOne({
  //   email: { $eq: email },
  //   function(err, obj) {
  //     if (obj) {
  //       errors.email = "Email id don";
  //     }
  //   },
  // })
  //   .then((user) => {
  //     if (user !== null) {
  //       // If the user exists, return Error
  //       if (user.email === email)
  //         errors.email = "Email: " + email + " is already taken";

  //       if (!isEmpty(errors)) {
  //         return res.status(403).json({ success: false, errors });
  //       }
  //     }
  //     user = new User({
  //       firstName: firstName,
  //       lastName: lastName,
  //       email: email,
  //       username: username,
  //       password: password,
  //     });

  //     user
  //       .save()
  //       .then((user) => {
  //         if (user) {
  //           console.dir(user);
  //           console.log(user.toJSON());
  //           res.json({
  //             success: true,
  //             full_messages: "User registered Successfully",
  //           });
  //         } else {
  //           console.log("user is empty ...???");
  //           res.json({ success: true, full_messages: "something went wrong" });
  //         }
  //       })
  //       .catch((err) => {
  //         throw err;
  //       });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).json({
  //       success: false,
  //       full_messages: err,
  //     });
  //   });
};
