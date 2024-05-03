// backend/controllers/userController.js

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const userCtrl = {};

userCtrl.register = async (req, res) => {  
    const body = req.body;
    try {
        const salt = await bcryptjs.genSalt();
        const hashPassword = await bcryptjs.hash(body.password, salt);
        const user = new User({
            username: body.username,
            email: body.email,
            password: hashPassword
        });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


userCtrl.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const isAuth = await bcryptjs.compare(password, user.password);
            if (isAuth) {
                const tokenData = {
                    id: user._id,
                    role: user.role
                };
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
                return res.json({ token, user });
            }
            return res.status(401).json({ error: 'Invalid email/password' });
        }
        res.status(404).json({ error: 'Invalid email/password' });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCtrl.getSingleUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)

        if (!user) {
               return res.status(404).json({ error: 'User not found' });
        }
        // const comments = await Comment.find({taskId : id})
        // return res.status(200).json({task, comments});
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

userCtrl.account = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// userCtrl.checkEmail = async (req, res) => {
//     try {
//         const { email } = req.query;
//         const user = await User.findOne({ email });
//         if (user) {
//             res.json({ is_email_registered: true });
//         } else {
//             res.json({ is_email_registered: false });
//         }
//     } catch (err) {
//         console.error('Error checking email:', err);
//         res.status(500).json({ error: 'Something went wrong while checking email' });
//     }
// };

module.exports = userCtrl;

