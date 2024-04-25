const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Producto',
        required: true
    },
    description: {
        type: String,
        default: 'Descripcion',
        required: true
    },
    price: {
        type: Number,
        default: 123,
        required: true
    },
    thumbnails: {
        type: Array,
        default: [],
        required: true
    },
    code: {
        type: String,
        default: 'qwerty123',
        required: true
    },
    stock: {
        type: Number,
        default: 1,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        default: "Predeterminada",
        required: true
    }
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;