const express = require('express')
const router = express.Router();
const shopController = require('../controllers/shop')

router.get('/cart', (req, res) => shopController.getCart(req, res))
router.get('/orders', (req, res) => shopController.getOrder(req, res))

router.post('/cart/add', (req, res) => shopController.addProductToCart(req, res))

router.post('/cart/delete', (req, res) => shopController.deleteProductFromCart(req, res))

router.post('/order/post', (req, res) =>  shopController.Order(req, res))

module.exports = router