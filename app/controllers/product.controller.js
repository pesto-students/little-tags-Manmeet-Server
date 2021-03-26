const Product = require("../models/product.model");
const User = require("../models/user.model");
const { checkAdminRights } = require("../utils/utils");

//! Completed
exports.getProducts = async (req, res) => {
  try {
    const isAdminRights = await checkAdminRights(req.user);
    const products = await Product.find();

    if (!products) {
      return res
        .status(404)
        .json({ status: false, full_messages: "No data found" });
    }

    if (!isAdminRights) {
      const currentUserProducts = products.filter(
        (product) => product._userId == req.user._id
      );
      console.log(currentUserProducts);
      return res.status(200).json(currentUserProducts);
    }
    res.status(200).json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

//! Completed
exports.addProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      image,
      categoryName,
      ...rest
    } = req.body;
    const date = Date.now();
    let newProduct = new Product({
      _userId: req.user._id,
      title,
      price,
      description,
      image,
      categoryName,
      date,
    });
    await newProduct
      .save()
      .then(() => res.status(200).json("Product added!"))
      .catch((err) =>
        res.status(500).json({ status: false, full_messages: "Server Error" })
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

exports.productDetail = async (req, res) => {
  try {
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }
    await Product.findById(req.params.id)
      .then((product) => res.json(product))
      .catch((err) => {
        console.error(err.message);
        res.status(500).json({ status: false, full_messages: "Server Error" });
      });
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.productDelete = async (req, res) => {
  try {
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }
    await Product.findByIdAndDelete(req.params.id)
      .then(() => res.json("Product deleted."))
      .catch((err) =>
        res.status(500).json({ status: false, full_messages: "Server Error" })
      );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

exports.productUpdate = async (req, res) => {
  const isAdminRights = await checkAdminRights(req.user);
  if (!isAdminRights) {
    return res.status(401).json({
      status: false,
      full_messages: "Access denied: Need Admin rights",
    });
  }
  await Product.findById(req.params.id)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.image = req.body.image;
      product.categoryName = req.body.categoryName;
      product.date = Date.now();
      product
        .save()
        .then(() => res.json("Product updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
};
