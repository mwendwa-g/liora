const {Product} = require("../models/product");
const {Category} = require("../models/category");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const upload = require('../models/storage')


//CREATING A PRODUCT
const fileUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 3}
]);
router.post(`/`, fileUpload ,async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) {
        return res.status(400).send("Invalid Category");
    }
    if (!req.files || !req.files.image) {
        return res.status(400).send("No image in the request");
    }

    const imageUrl = req.files.image[0].path; 
    const galleryUrls = req.files.gallery ? req.files.gallery.map(file => file.path) : [];

    try{
        let product = new Product({
            image: imageUrl,
            gallery: galleryUrls,
            description: req.body.description,
            name: req.body.name,
            price: req.body.price,
            originalprice: req.body.originalprice,
            sizes: req.body.sizes,
            color: req.body.color,
            stock: req.body.stock,
            featured: req.body.featured,
            category: req.body.category,
            brand: req.body.brand,
            reviews: req.body.numReviews,
            //rating: req.body.rating
        })
        product = await product.save();
        await updateProductCount(req.body.category);
        if(!product){
            return res.status(500).send('the product cannot be created!')
        }
        res.send(product)
    }catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: "A product with this name already exists. Please choose a different name."
            });
        }
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
})

//GETTING ALL PRODUCTS WHICH ALSO GETS PRODUCTS BY CATEGORY
router.get(`/`, async (req, res) => {
    //loalhost:3000/api/f1/products?categories=3948,20498
    let filter = {};
    if(req.query.categories) {
        const categoryIds = req.query.categories.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
        filter = { category: { $in: categoryIds }, status: 'active' };
    }
    const productList = await Product.find(filter).populate('category');
    if(!productList){
        res.status(500).json({success: false, message: 'No products found!'})
    }
    res.send(productList)
})

//GETTING A SINGLE PRODUCT
router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success: false})
    }
    res.send(product);
})

//UPDATING A PRODUCT
router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("Invalid product ID");
    }

    try {
        const { action, size, status, featured, ...otherUpdates } = req.body; // Extract 'action' and 'size'

        // Find the product by ID
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');

        // ✅ Handle size updates separately
        if (action && size) {
            if (action === "add") {
                if (!product.sizes.includes(size)) {
                    product.sizes.push(size); // Add the size
                } else {
                    return res.status(400).json({ message: "Size already exists" });
                }
            } else if (action === "remove") {
                product.sizes = product.sizes.filter(s => s !== size); // Remove the size
            } else {
                return res.status(400).json({ message: "Invalid action" });
            }

            await product.save();
            return res.json({ message: `Size ${action}ed successfully!`, product });
        }
        if (status !== undefined) {
            product.status = status;
            await product.save();
        }

        if (featured !== undefined) {
            product.featured = featured;
            await product.save();
        }

        // ✅ Update other product fields (only update fields that exist in the request)
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: otherUpdates },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(400).send('The product cannot be updated!');
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send("Server error");
    }
});

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

// Fetch products based on cart items
router.post("/cart/items", async (req, res) => {
    try {
        const cart = req.body.cart;

        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty or invalid" });
        }
        const productIds = cart.map(item => item.product_id);

        const products = await Product.find({ _id: { $in: productIds } }).populate("category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart items", error });
        return;
    }    
});



async function updateProductCount(categoryId) {
    const count = await Product.countDocuments({ category: categoryId });
    await Category.findByIdAndUpdate(categoryId, { productCount: count });
}

module.exports = router 