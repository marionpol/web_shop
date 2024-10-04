const Product = require('../models/product')
const Cart = require('../models/cart')
const CartItem = require('../models/cart-item');

class shopController {
    async getAllProducts(req, res) {
        const products = await Product.findAll()
        console.log(products)
        res.status(201).json({
            products: products
        })
    }
       
    async getCart(req, res) {
        
        const userCart = await req.user.getCart()

        const cartProducts = await userCart.getProducts()
        res.status(201).json({
            products: cartProducts
        })
              
    }

    async addProductToCart(req, res) {
        const productId = req.body.productId;
        const userId = req.user.id;
    
        const userCart = await Cart.findOrCreate({
            where: { userId },
            defaults: { userId }
        });
    
        const cartItem = await CartItem.findOrCreate({
            where: { cartId: userCart[0].id, productId }
        });
    
        cartItem[0].quantity++;
        await cartItem[0].save();
    
        res.status(200).json({ message: 'Product added to cart' });
    }

    async deleteProductFromCart(req, res) {
        const productId = req.body.productId;
        const userId = req.user.id;
    
        const userCart = await Cart.findOne({ where: { userId } });
        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
    
        const cartItem = await CartItem.findOne({ where: { cartId: userCart.id, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
    
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            await cartItem.save();
            return res.status(200).json({ message: 'Product quantity decreased' });
        } else {
            await cartItem.destroy();
            return res.status(200).json({ message: 'Product removed from cart' });
        }
    }


}

module.exports = new shopController();