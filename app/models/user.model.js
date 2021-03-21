const mongoose = require("mongoose");

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

UserSchema.methods.isValidPassword = function (candidatePassword, callback) {
  // Since we used path('password') now password is no longer a simple string, but an object, to access its value we can:
  // bcrypt.compareSync(candidatePassword, this.get('password'))
  bcrypt.compare(
    candidatePassword,
    this.password.toObject(),
    function (err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
    }
  );
};

// Model
const User = mongoose.model("User", UserSchema);

module.exports = User;
