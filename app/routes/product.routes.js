const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product.controller");

router.get("/", ProductController.getProducts);
router.post("/add", ProductController.addProduct);
router.get("/:id", ProductController.productDetail);
router.delete("/:id", ProductController.productDelete);
router.put("/update/:id", ProductController.productUpdate);
module.exports = router;
