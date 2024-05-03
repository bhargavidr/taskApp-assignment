// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findOne({ _id: decoded.id});
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Please authenticate' });
    }
};

exports.authorizeUser = (req, res, next) => {
    
}