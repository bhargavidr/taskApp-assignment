// backend/models/Comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    createdAt: {
        type: Date, //B - removed default as time should also be added in Ctrl
        required:true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Reference to the Task model
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
