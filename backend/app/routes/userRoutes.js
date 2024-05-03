// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

// import controllers
const userCtrl = require('../controllers/userCtrl');

//import validations
const validateRegister = require('../validations/validateRegister')
const validateLogin = require('../validations/validateLogin')
const isValidID = require('../validations/idValidation')


router.post('/register', validateRegister, userCtrl.register);
router.post('/login', validateLogin, userCtrl.login);
router.get('/account',authMiddleware.authenticateUser, userCtrl.account);
router.get('/:id', isValidID, userCtrl.getSingleUser)


module.exports = router;

