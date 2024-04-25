const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: Number
        }],
        default: [],
        required: true
    }
});

// Populate
cartSchema.pre('findOne', function (next) {
    this.populate('products.product')
    next()
})
cartSchema.pre('find', function (next) {
    this.populate('products.product')
    next()
})

cartSchema.plugin(mongoosePaginate);
const CartModel = mongoose.model('carts', cartSchema);

module.exports = CartModel;