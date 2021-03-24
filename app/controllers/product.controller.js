const Product = require("../models/product.model");

exports.getProducts = async (req, res) => {
  await Product.find()
    .then((products) => res.json(products))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.addProduct = async (req, res) => {
  const { title, price, description, image, categoryName } = req.body;
  const date = Date.now();
  let newProduct = new Product({
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
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.productDetail = async (req, res) => {
  await Product.findById(req.params.id)
    .then((product) => res.json(product))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.productDelete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
    .then(() => res.json("Product deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.productUpdate = async (req, res) => {
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
