const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

//GETTING ALL CATEGORIES
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

//GETTING FOUR CATEGORIES
router.get(`/four`, async (req, res) => {
    const categoryList = await Category.find().limit(4);

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

//GETTING A SINGLE CATEGORY
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'category not found'});
    }
    res.status(200).send(category);
})

//CREATING A CATEGORY
router.post('/', async (req,res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if(!category)
    return res.status(400).send('the category cannot be created!')

    res.send(category);
})

//DELETE A CATEGORY
router.delete('/:id',(req,res)=>{
    Category.findByIdAndDelete(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        }else{
            return res.status(404).json({success: false, message: "category not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

//UPDATING A CATEGORY
router.put('/:id', async (req,res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {
            new: true
        }
    )

    if(!category)
    return res.status(400).send('the category cannot be updated!')

    res.send(category);
})

module.exports = router;