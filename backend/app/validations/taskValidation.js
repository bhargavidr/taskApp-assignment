const Task = require('../models/Task')
const Joi = require('joi')

const taskValidate = {}

const updateTask = Joi.object({
    title: Joi.string().trim(true),

    description: Joi.string(),

    dueDate:Joi.date().greater('now').message('due date must not be in the past'),

    priority:Joi.string().valid('high','medium','low').trim(true),

    status: Joi.boolean().truthy('complete').falsy('incomplete')
            
})

taskValidate.update = async(req,res,next) => {
    try {
        const { error } = updateTask.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json(error);
        }
        next()
    } catch (err) {
        return res.status(400).json(err);
    }
}

//check if the id provided in parameters is a valid mongodb ID - didn't use joi
taskValidate.isValidID = async(req,res,next) => {
    const Pattern = /^[0-9a-fA-F]{24}$/
    if(Pattern.test(req.params.id)){
        next()
    }else{
        res.status(400).send({error:'Invalid MongDB ID'})
    }
}

module.exports = taskValidate

