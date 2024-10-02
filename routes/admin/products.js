const express = require('express')
const router = express.Router();
const productController = require('../../controllers/admin/product')

router.get('/products', (req, res) => productController.getAllProducts(req, res));

router.get('/products/:id', (req, res) =>
productController.getProductById(req, res));

router.post('/product/add', (req, res) => productController.addProduct(req, res));

router.post('/product/update/:id', (req, res)=> productController.updateProduct(req, res));

router.post('/product/delete/:id', (req, res)=> productController.deleteProduct(req, res));

module.exports = router;