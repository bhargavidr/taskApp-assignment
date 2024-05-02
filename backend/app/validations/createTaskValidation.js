const Task = require('../models/Task')
const Joi = require('joi').extend(require('@hapi/joi-date'));

const createTaskValidationExpress = {
    title: {
        notEmpty: {
            errorMessage: 'username is required'
        },
        custom: {
            options: async function(value){
                const title = await Task.findOne({ title: value })
                if(title) {
                    throw new Error('title already taken')
                } else {
                    return true 
                }
            }
        },
        trim: true 
    },
    description:{
        notEmpty: {
            errorMessage: 'description is required'
        },
        trim: true 
    },
    dueDate:{
        notEmpty: {
            errorMessage: 'date is required'
        },
        isDate:{
            errorMessage: 'invalid date format'
        },
        trim: true 
    }
}

const createTask = Joi.object({
    title: Joi.string()
                .required()
                .trim()
            .custom(async (value,msg)=>{
                const title = await Task.findOne({ title: value })
                // console.log(title, 'title')
                if(title) {
                    return msg.message('title already taken')
                }
                return true
            }),
    
    description: Joi.string()
                    .required(),

    dueDate:Joi.date()
                .greater('now').message('due date must not be in the past')
                .required(),

    priority:Joi.string()
                .valid('high','medium','low')
                .required()
                .trim(true),

    status: Joi.boolean().truthy('complete').falsy('incomplete')
    
})

module.exports = createTask