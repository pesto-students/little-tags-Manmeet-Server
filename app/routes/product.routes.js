const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller");

// const adminAuth = require("../middleWare/adminAuth");
const auth = require("../middleWare/auth");

/**
 * @route   GET request with (api/v1/products)
 * @desc    get all product for the admin and list corresponding product for the specific user(Normal)
 * @access  Private
 */
router.get("/", ProductController.getProducts);

/**
 * @route   GET request with (api/v1/products/:id)
 * @desc    get a product for the given productId.
 * @access  Private (Can be accessed only by Admin)
 */
router.get("/:id", auth, ProductController.productDetail);

/**
 * @route   DELETE (api/v1/products/:id)
 * @desc    delete a product for the given productId.
 * @access  Private (Can be accessed only by Admin)
 */
router.delete("/:id", auth, ProductController.productDelete);

/**
 * @route   PUT (api/v1/products/:id)
 * @desc    update a product for the given productId
 * @access  Private (Can be accessed only by Admin)
 */
router.put("/:id", auth, ProductController.productUpdate);

/**
 * @route   POST api/v1/products/add
 * @desc    Add a new product
 * @access  Public
 */
router.post("/", auth, ProductController.addProduct);

module.exports = router;
