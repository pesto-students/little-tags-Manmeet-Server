const bcrypt = require("bcrypt");

exports.saltGenerator = function () {
  const saltRounds = Math.floor(Math.random() * 10 + 1);
  const salt = bcrypt.genSaltSync(saltRounds);
  return salt;
};

exports.passwordGenerator = function (candidatePassword, salt) {
  const passwordHash = bcrypt.hashSync(candidatePassword, salt);
  return passwordHash;
};
