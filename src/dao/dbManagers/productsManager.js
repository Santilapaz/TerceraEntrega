const ProductModel = require("../models/product.model");

class ProductManager {

    async addProduct(product) {
        const existingProduct = await ProductModel.findOne({ code: product.code });

        if (existingProduct) {
            throw new Error('Ya existe un producto con ese codigo.');
        }

        try {
            await ProductModel.create(product);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw error;
        }
    }

    async getProducts() {

        try {
            let products = await ProductModel.find().lean();
            return products;
        } catch (error) {
            console.error('Error al leer los productos:', error);
            throw error;
        }
    }

    async getProductById(id) {

        try {
            let products = await ProductModel.find({_id: id}).lean();
            return products[0];
        } catch (error) {
            console.error('Error al leer los productos:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedValues) {
        try {
            await ProductModel.updateOne({_id: id}, updatedValues);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            await ProductModel.deleteOne({_id: id})
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
    
}

module.exports = ProductManager;