const express = require('express');
const router = express.Router();
const User = require('../models/Users');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sujalsensei';

const fetchuser=require('../middleware/fetchuser');

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password of more than 5 char').isLength({ min: 5 })
], async (req, res) => {
    let success=false;
    /*given snippet from express validation*/
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email })//check for uniqur email in db
        if (user) {
            res.status(400).json({ success,error: "sorry same email already exists" })
        }

        //encrypting password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,//encrypted password
        })
        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);//generating token so that server can authorise the session
        console.log(authtoken);
        success=true;
        res.json({ success,authtoken });
    } catch (error) {
        console.log(error);
        res.status(500).send("some error occured");
    }

})

router.post('/login', [
    
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists()
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body;

    try {
        let user=await User.findOne({email});

        if(!user){
            success=false;
            return res.status(400).json({success,error:"Invalid credentials"});
        }

        const comparePassword=await bcrypt.compare(password,user.password);
        if(!comparePassword){
            success=false;
            return res.status(400).json({success,error:"Invalid credentials"});
        }

        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);//generating token so that server can authorise the session
        
        success=true;
        res.json({ success,authtoken });

    } catch (error) {
        console.log(error);
        res.status(500).send("some error occured");
    }


})

router.post('/getuser',fetchuser, async (req, res) => {


    try {
        userid=req.user.id;
        console.log(userid)
        const user=await User.findById(userid).select('-password');
        console.log(user);
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("some error occured");
    }
})
module.exports = router;