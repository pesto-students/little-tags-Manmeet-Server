const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller");

// const adminAuth = require("../middleWare/adminAuth");
const auth = require("../middleWare/auth");
/**
 * @route   PUT, DELETE and GET request with (api/v1/products)
 * @desc    get,delete,update of an product
 * @access  Private (Can be accessed only by Admin)
 */
router.get("/", auth, ProductController.getProducts);
router.get("/:id", auth, ProductController.productDetail);

/**
 * @route   DELETE (api/v1/products/:id)
 * @desc    delete a product for an Admin User.
 * @access  Private (Can be accessed only by Admin)
 */
router.delete("/:id", auth, ProductController.productDelete);
router.put("/update/:id", auth, ProductController.productUpdate);

/**
 * @route   POST api/v1/products/add
 * @desc    Add new product.
 * @access  Public
 */
router.post("/add", auth, ProductController.addProduct);

module.exports = router;
