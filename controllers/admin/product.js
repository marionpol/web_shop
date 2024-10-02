const Product = require('../../models/product')

class adminController {

    async getAllProducts(req, res) {
        const products = await Product.findAll()
        console.log(products)
        res.status(201).json({
            products: products
        })
    }

    async getProductById(req, res) {
        const product = await Product.findByPk(req.params.id)
        res.status(201).json({
            product: product
        })
    }

    async addProduct(req, res) {
        const product = await Product.create({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            userId: req.user.id
        })
        res.status(201).json({
            message: 'Product has been added',
            productId: product.id
        })
        
    }

    async updateProduct(req, res){
        const product = await Product.findByPk(req.params.id)

        const productData = {
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description
        }

        await product.update(productData)

        res.status(201).json({
            message: 'Product has been updated',
            productId: product.id
        })
        
    }

    async deleteProduct(req, res){
        const productId = req.params.id

        const product = await Product.findByPk(productId)

        await product.destroy()
        
        res.status(201).json({
            message: 'Product has been deleted',
            productId: product.id
        })

    }

}

module.exports = new adminController();