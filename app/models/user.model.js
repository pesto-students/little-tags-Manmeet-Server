const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  isGuest: {
    type: Boolean,
    required: [true, "can't be blank"],
  },
  dateCreated: {
    type: String,
    default: new Date(),
  },
  email: {
    type: String,
    required: [true, "can't be blank"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  userName: {
    type: String,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z]+$/, "is invalid"],
  },
  randomSalt: {
    type: String,
    required: [true, "can't be blank"],
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: false,
    match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, "is invalid"],
  },
  isThirdPartyAuth: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.SaltGenerator = () => {
  const saltRounds = Math.floor(Math.random() * 50 + 1);
  const salt = bcrypt.genSaltSync(saltRounds);
  return salt;
};

UserSchema.methods.isValidPassword = (candidatePassword) => {
  const passwordHash = bcrypt.hashSync(candidatePassword, salt);
  return passwordHash;
};

// Model
const User = mongoose.model("User", UserSchema);

module.exports = User;
