const Product = require('../models/product')
const Cart = require('../models/cart')
const CartItem = require('../models/cart-item');
const Order = require('../models/orders')
const OrderItem = require('../models/order-item')

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

    async getOrder(req, res) {
        const orders = await Order.findAll({
            include: [ 
                {
                    model: Product,
                    through: OrderItem, 
                },
            ],
        });
        res.status(200).json({ orders });
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
            userCart.cartItems = [];
            await userCart.save();
            return res.status(200).json({ message: 'Product removed from cart' });
        }
    }

        async Order(req, res) {
            const userCart = await req.user.getCart()

            const cartProducts = await userCart.getProducts()

            if (cartProducts.length === 0) {
                return res.status(400).json({ message: 'Your cart is empty' });
              }

            const newOrder = await Order.create({
                userId: req.user.id,
            });
            
            await Promise.all(cartProducts.map(async (products) => { console.log( products)
                await OrderItem.create({
                  orderId: newOrder.id,
                  productId: products.id,
                  quantity: products.cartItem.quantity,
                  price: products.price,
                });
                
              }));
          
              await CartItem.destroy({ where: { cartId: userCart.id } });
          
              res.status(200).json({ message: 'Order placed successfully' });
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Error processing order' });
            

        }


}

module.exports = new shopController();