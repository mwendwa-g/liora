const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16 22v-2h4v-2h-4v-2h4v-2h-4v-2h4v-2h-4V8h4V6h-4V4h7v18zM5 22L1 11l5-3V2h4v6l5 3l-4 11z"/></svg>'
    },
    color: { 
        type: String,
        default: '#c9a654'
    },
    productCount: { 
        type: Number, 
        default: 0 
    }
})

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {
    virtuals: true,
});

exports.Category = mongoose.model('Category', categorySchema);