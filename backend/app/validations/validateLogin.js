const Joi = require('joi')

//schema for login validation
const login = Joi.object({
    email: Joi.string()
            .required()
            .email()
            .trim(true),

    password:Joi.string()
                .min(5)
                .max(20)
                .required() 
})

validateLogin = async(req,res,next) => {
    try {
        const { error, value } = login.validate(req.body, { abortEarly: false });
        if (error) {
            // console.log(error, 'validation')
            return res.status(400).json(error.details);
        }
        next()
    } catch (err) {
        return res.status(400).json(err);
    }
}

module.exports = validateLogin