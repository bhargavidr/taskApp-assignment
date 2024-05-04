const Task = require('../models/Task')
const Joi = require('joi')

const taskValidate = {}

//validation for create task
const createTask = Joi.object({
    title: Joi.string()
                .required()
                .trim(),
    
    description: Joi.string()
                    .required(),

    dueDate:Joi.date()
                .greater('now').message('due date must not be in the past')
                .required(),

    assignedTo:Joi.array().min(1),

    priority:Joi.string()
                .valid('high','medium','low')
                .trim(true),

    status: Joi.string()
                .valid('To do','In Progress','Completed').trim(true)
    
})

const customAsync = async(value) => {
    const task = await Task.findOne({title:value})
    // console.log(task, 'repeated title object')
    if(task){
        throw new Joi.ValidationError('Task Title', [{
            message: 'Task title already exists',
            type: 'custom',
            path: ['string'],
            value,
        }]);
    }
}

taskValidate.create = async (req,res,next) => {
    try{
        const {error, value} = createTask.validate(req.body, { abortEarly: false })
        if(error){
            return res.status(400).send(error.details)
        }
        await customAsync(value.title)
        next()
    }catch(err){
        return res.status(400).json(err);
    }
}

//validation for task update
const updateTask = Joi.object({
    title: Joi.string().trim(true),

    description: Joi.string(),

    dueDate:Joi.date().greater('now').message('due date must not be in the past'),

    priority:Joi.string().valid('high','medium','low').trim(true).insensitive(),

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

module.exports = taskValidate

