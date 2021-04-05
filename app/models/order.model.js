const mongoose = require("mongoose");

// Schema
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      netPrice: { type: Number, required: true },
      productId: {
        type: String,
        required: true,
      },
    },
  ],
  shippingAddress: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  // paymentResult: {
  //   id: {
  //     type: String,
  //   },
  //   status: {
  //     type: String,
  //   },
  //   update_time: {
  //     type: String,
  //   },
  //   email_address: {
  //     type: String,
  //   },
  // },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderDate: {
    type: Date,
    required: false,
  },
});

// Model
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
