const {Product} = require("../models/product");
const {Category} = require("../models/category");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const upload = require('../models/storage')

/*
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid) {
            uploadError = null;
        }
        const uploadPath = path.resolve(__dirname, '..', 'public', 'uploads');
      cb(uploadError, uploadPath);
    },
    
    filename: function (req, file, cb) {
      const fileName = file.originalname.replace(' ','-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploadOptions = multer({ storage: storage }) */

//CREATING A PRODUCT
router.post(`/`, upload.single('image'), async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(400).send("Invalid Category");
    }
    const file = req.file;
    if(!file) {
        return res.status(400).send("no image in the request");
    }
    
    const imageUrl = file.path; 

    let product = new Product({
        image: imageUrl,
        description: req.body.description,
        richDescription: req.body.richDescription,
        originalprice: req.body.originalprice,
        currentprice: req.body.currentprice,
        weight: req.body.weight,
        colors: req.body.colors,
        countInStock: req.body.countInStock,
        isFeatured: req.body.isFeatured,
        category: req.body.category,
        brand: req.body.brand,
        numReviews: req.body.numReviews,
        rating: req.body.rating
    })
    product = await product.save();
    await updateProductCount(req.body.category);
    if(!product){
        return res.status(500).send('the product cannot be created!')
    }
    res.send(product)
})

//GETTING PRODUCTS WHICH ALSO GETS PRODUCTS BY CATEGORY
router.get(`/`, async (req, res) => {
    //loalhost:3000/api/f1/products?categories=3948,20498
    let filter = {};
    if(req.query.categories) {
        const categoryIds = req.query.categories.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
        filter = { category: { $in: categoryIds } };
    }
    const productList = await Product.find(filter).populate('category');
    if(!productList){
        res.status(500).json({success: false, message: 'No products found!'})
    }
    res.send(productList)
})

//GETTING A SINGLE PRODUCT
router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        res.status(500).json({success: false})
    }
    res.send(product);
})

//UPDATING A PRODUCT
router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send("invalid product id");
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            image: req.body.image,
            description: req.body.description,
            richDescription: req.body.richDescription,
            originalprice: req.body.originalprice,
            currentprice: req.body.currentprice,
            sizes: req.body.sizes,
            colors: req.body.colors,
            countInStock: req.body.countInStock,
            isFeatured: req.body.isFeatured,
            category: req.body.category,
            brand: req.body.brand,
            numReviews: req.body.numReviews,
            rating: req.body.rating
        },
        {new: true}
    ) 
    if(!product){
        return res.status(400).send('the product cannot be updated!')
    }
    res.send(product);
})

//DELETING A PRODUCT
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        await Product.findByIdAndDelete(req.params.id);
        await updateProductCount(product.category);
        return res.status(200).json({ success: true, message: 'Product is deleted!' });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});


//SHOWING NUMBER OF PRODUCTS
router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments();

    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.send({productCount: productCount});
})

//GETTING FEATURED PRODUCTS
router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured: true}).limit(+count);

    if(!products) {
        res.status(500).json({success: false})
    }
    res.send(products);
})

//SETTING PRODUCT GALLERY
router.put(
    '/gallery-images/:id', 
    upload.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagePaths = [];

         if(files) {
            imagePaths = files.map((file) => file.path);
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagePaths
            },
            { new: true}
        )

        if(!product) return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)

// Fetch products based on cart items
router.post("/cart/items", async (req, res) => {
    try {
        const cart = req.body.cart; // Expecting [{ product_id: "productId" }, ...]

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty or invalid" });
        }

        // Extract product IDs from the cart
        const productIds = cart.map(item => item.product_id); // No need for ObjectId conversion

        // Fetch products from MongoDB
        const products = await Product.find({ _id: { $in: productIds } }).populate("category");

        res.json(products); // Directly return product details
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: "Error fetching cart items", error });
    }
});



async function updateProductCount(categoryId) {
    const count = await Product.countDocuments({ category: categoryId });
    await Category.findByIdAndUpdate(categoryId, { productCount: count });
}

module.exports = router 
