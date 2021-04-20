const Product = require("../models/product.model");
const User = require("../models/user.model");
const { checkAdminRights } = require("../utils/utils");

// get all products detail
exports.getProducts = async (req, res) => {
  try {
    // const isAdminRights = await checkAdminRights(req.user);
    const products = await Product.find();
    if (!products) {
      return res
        .status(404)
        .json({ status: false, full_messages: "No data found" });
    }

    // if (!isAdminRights) {
    //   const currentUserProducts = products.filter(
    //     (product) => product._userId == req.user._id
    //   );
    //   return res.status(206).json(currentUserProducts);
    // }
    res.status(200).json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

// add a new product
exports.addProduct = async (req, res) => {
  try {
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }
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
      .then(() =>
        res.status(201).json({ status: true, full_messages: "Product added!" })
      )
      .catch((err) =>
        res.status(500).json({ status: false, full_messages: "Server Error" })
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

// get a product detail by id
exports.productDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, full_messages: "No data found" });
    }
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }
    res.status(202).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

// delete a product by id from collections
// get product detail
exports.productDelete = async (req, res) => {
  try {
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, full_messages: "No data found" });
    }
    res.status(200).json({ status: false, full_messages: "Product deleted." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};

// update(put) a product by id
exports.productUpdate = async (req, res) => {
  try {
    const isAdminRights = await checkAdminRights(req.user);
    if (!isAdminRights) {
      return res.status(401).json({
        status: false,
        full_messages: "Access denied: Need Admin rights",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ status: false, full_messages: "No data found" });
    }
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.body.image;
    product.categoryName = req.body.categoryName;
    await product.save();
    res.status(201).json({ status: true, full_messages: "Product Updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, full_messages: "Server Error" });
  }
};
