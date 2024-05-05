const Task = require('../models/Task');
const Comment = require("../models/Comment")
const AuthLayer = {}


AuthLayer.deleteTask = async (req,res,next) => {
    const task = await Task.findById(req.params.id)
        if(task.createdBy.id == req.user.id || task.assignedTo.includes[req.user.id]){
            next()
        }else{
            return res.status(403).json({Unauthorized:'You cannot access this page'})
        }     
}

AuthLayer.task = async (req,res,next) => {
    const task = await Task.findById(req.params.id)
        if(task.createdBy.id == req.user.id){
            next()
        }else{
            return res.status(403).json({Unauthorized:'You cannot access this page'})
        }     
}

AuthLayer.comment = async (req,res,next) => {
    const comment = await Comment.findById(req.params.id)
        if(comment.createdBy.id == req.user.id){
            next()
        }else{
            return res.status(403).json({Unauthorized:'You cannot access this page'})
        }     
}
module.exports = AuthLayer