const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
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
    data: Buffer,
    contentType: String,
  },
  categoryName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
});

// Model
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
