const Task = require('../models/Task');
const Comment = require("../models/Comment")
const AuthLayer = {}


AuthLayer.task = async (req,res,next) => {
    const task = await Task.findById(req.params.id)
        if(task.createdBy == req.user.id){
            next()
        }else{
            return res.status(403).json({Unauthorized:'You cannot access this page'})
        }     
}

AuthLayer.comment = async (req,res,next) => {
    const comment = await Comment.findById(req.params.id)
        if(comment.createdBy == req.user.id){
            next()
        }else{
            return res.status(403).json({Unauthorized:'You cannot access this page'})
        }     
}
module.exports = AuthLayer