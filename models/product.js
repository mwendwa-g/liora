const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String,
    }],
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        required: true
    },
    originalprice : {
        type: Number,
        default:0
    },
    currentprice : {
        type: Number,
        default:0
    },
    weight: {
        type: String,
        required: true
    },
    colors: [{
        type: String,
    }],
    countInStock: {
        type: Number,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    brand: {
        type: String,
        default: ''
    },
    numReviews: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 3.5,
    }
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);
