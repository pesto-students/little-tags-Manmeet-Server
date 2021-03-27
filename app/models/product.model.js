const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  categoryName: {
    type: String,
    required: true,
  },
});

// Model
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
