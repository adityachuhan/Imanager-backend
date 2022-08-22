const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findOne } = require('../models/User');
const fetchuser = require('../midleware/fetchuser')

const JWT_SECRET = "iamagood@boy";

//ROUTE:1 Creating a user using:POST at '/api/auth/createuser'  and no login required
router.post('/createuser', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('passward', 'Passward must be of atleast of 6 characters').isLength({ min: 6 }),
    body('name', 'name must be of atleast of 5 characters').isLength({ min: 5 }),
], async(req, res) => {

    try {
        // if there are errors , return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //  check whether this email exists or not 
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Soory the user with these credentials already exists" })
        }
        let salt = await bcrypt.genSalt(10)
        let paswd = await bcrypt.hash(req.body.passward, salt)
        user = await User.create({
            name: req.body.name,
            passward: paswd,
            email: req.body.email,
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({ authToken: authToken });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal servor errror");
    }
})

//ROUTE:2 Authenticate  a user using:POST at '/api/auth/login'  and no login required
router.post('/login', [
        body('email', 'Enter a valid E-mail').isEmail(),
        body('passward', 'Passward cannot be blanked').exists(),
    ], async(req, res) => {

        try {
            // if there are errors , return bad request and errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let { passward, email } = req.body;
            let user = await User.findOne({ email: email })
            if (!user) {
                return res.status(400).json({ error: "Please login with a correct credentials" })
            }
            const passwardCompare = await bcrypt.compare(passward, user.passward);
            if (!passwardCompare) {
                return res.status(400).json({ error: "Please login with a correct credentials" })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            res.json({ authToken: authToken });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal servor errror");
        }
    })
    //ROUTE:3 getting user details using:POST at '/api/auth/getuser'  and  login required
router.post('/getuser', fetchuser, async(req, res) => {
    try {

        let userid = req.user.id
        let userdetial = await User.findById(userid).select("-passward");
        res.send(userdetial)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal servor errror");
    }

})

module.exports = router