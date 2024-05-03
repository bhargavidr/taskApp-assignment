const User = require('../models/user')
const Joi = require('joi')

const RegisterWithExpress = {
    username: {
        notEmpty: {
            errorMessage: 'username is required'
        },
        trim: true 
    },
    email: {
        notEmpty: {
            errorMessage: 'email is required'
        }, 
        isEmail: {
            errorMessage: 'invalid  email format'
        }, 
        custom: {
            options: async function(value){
                const user = await User.findOne({ email: value })
                if(user) {
                    throw new Error('email already taken')
                } else {
                    return true 
                }
            }
        },
        trim: true,
        normalizeEmail: true 
    },
    password: {
        notEmpty: {
            errorMessage: 'password is required'
        },
        isLength: {
            options: {min: 8, max: 128},
            errorMessage: 'password should be between 8 - 128 characters'
        },
        trim: true 
    }
}

const userValidate ={}

//schema for register validation
const register = Joi.object({
    username: Joi.string()
                .required(),

    email: Joi.string()
            .required()
            .email()
            .trim(true),

    password:Joi.string()
                .min(8)
                .max(128)
                .required()               
})

//custom validation for email
const validateAsync = async (value) => {
    const user = await User.findOne({ email: value });
    // console.log(user, 'user custom validation');
    if (user) {
        throw new Joi.ValidationError('Email already taken', [{
            message: 'Email already taken',
            type: 'string.email',
            path: ['email'],
            value,
        }]);
    }
};



//validators
const validateRegister = async(req,res,next) => {
    try {
        const { error, value } = register.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log(error, 'validation')
            return res.status(400).json(error.details);
        }
        await validateAsync(value.email);
        next()
    } catch (err) {
        return res.status(400).json(err);
    }
}


module.exports = validateRegister