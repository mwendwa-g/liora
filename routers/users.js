const {User} = require("../models/user");
const {Order} = require("../models/order");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//CREATING A USER ACCOUNT - ADMIN
router.post('/', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

//CHANGING PASSWORD
router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            passwordHash: newPassword
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('Password cannot be changed!')

    res.send(user);
})

//FETCHING ID BASED ON EMAIL
router.get('/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.send(user);
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});



//CREATING A USER ACCOUNT - USER
router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

//GETTING LIST OF USERS
router.get(`/`, async (req, res)=>{
    const userList = await User.find().select('-passwordHash');
    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList)
})

//GETTING A SINGLE USER
router.get(`/:id`, async (req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user){
        res.status(500).json({success: false})
    }
    res.send(user);
})

//LOGIN API
router.post('/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    const secret = process.env.SECRET;
    if(!user){
        return res.status(400).send('the user not found')
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn: '1d'}
        )
        res.status(200).send({user: user.email, token: token});
    }else{
        res.status(400).send("password is wrong");
    }
})

//GETTING USER COUNT
router.get(`/get/count`, async (req, res) => {
    const userCount = await User.countDocuments();
    if(!userCount) {
        res.status(500).json({success: false});
    }
    res.send({userCount: userCount});
})

//DELETING A USER

router.delete('/:id', async (req, res) => {
    try {
        // Find the user first
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Delete all orders related to this user
        await Order.deleteMany({ user: user._id });

        // Now delete the user
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "User and their orders deleted!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;