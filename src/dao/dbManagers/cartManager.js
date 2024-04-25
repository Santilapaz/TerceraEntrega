const CartModel = require("../models/cart.model");

class CartManager {

    async addCart() {
        const cart = {products: []}
        await CartModel.create(cart);
    }

    async getCart(id) {
        const cart = await CartModel.findOne({_id: id})
        return cart;
    }
    
    async getCartLean(id) {
        const cart = await CartModel.find({_id: id}).populate('products.product').lean()

        if(!cart || cart.length == 0){
            throw new Error('No existe el carrito')
        }

        return cart[0];
    }
    
    async getAllCarts() {
        try {
            let carts = await CartModel.find().lean();
            return carts;
        } catch (error) {
            console.error('Error al leer los carritos:', error);
            throw error;
        }
    }

    async addProduct(id, productId) {
        const cart = await this.getCart(id);

        const index = cart.products.findIndex(p=>p.product._id.toString() == productId)
        if(index >= 0){
            cart.products[index].quantity += 1;  
        }else{
            cart.products.push({product: productId, quantity:1})
        }

        await CartModel.updateOne({_id: id}, cart)
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error('Cart not found');
            }
    
            cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
    
            await cart.save();
        } catch (error) {
            console.error(`Error al borrar el producto del carrito: ${error.message}`);
            throw error;
        }
    }

    async updateCart(id, productList) {
        
        try {
            const cart = await this.getCart(id)

            productList.forEach(pl => {

                const index = cart.products.findIndex(p=>p.product._id.toString() == pl.product)

                if(index >= 0) { // si este producto ya existe, simplemente actualiza los valores
                    cart.products[index].quantity += pl.quantity;  
                }else{
                    cart.products.push({product: pl.product, quantity: pl.quantity})
                }
            });
    
            await CartModel.updateOne({_id: id}, cart);
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw error;
        }
    }

    async updateQuantity(cartId, productId, newProductQuantity) {
        try {
            const cart = await this.getCart(cartId)

            const index = cart.products.findIndex(p=>p.product._id.toString() == productId)

            if(index >= 0) {
                cart.products[index].quantity = newProductQuantity;  
            }else{
                console.error('Hubo un error al actualizar la cantidad del producto')
            }

            await CartModel.updateOne({_id: cartId}, cart);
        } catch (error) {
            console.error('Error al actualizar la cantidad:', error);
            throw error;
        }
    }

    async deleteAllProducts(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
    
            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.products = [];
    
            await cart.save();
        } catch (error) {
            console.error(`Error al borrar todos los productos del carrito: ${error.message}`);
            throw error;
        }
    }

}

module.exports = CartManager;