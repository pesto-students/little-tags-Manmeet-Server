const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
// Schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  isGuest: {
    type: Boolean,
    default: false,
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
    match: [/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, "is invalid"],
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// generating token
UserSchema.methods.generateAuthToken = async function () {
  try {
    const SECRET_KEY = config.get("SECRET_KEY");
    const token = jwt.sign({ _id: this._id }, SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

// Model
const User = mongoose.model("User", UserSchema);

module.exports = User;
