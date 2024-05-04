const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: Object,
        ref: 'User', // Reference to the User model
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }],
    status: {
        type: String,
        default: 'To Do'
    },
    priority: {
        type: String,
        default: 'Medium'
    },
    dueDate:{
        type:String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    timeSpent: {
        type: Number,
        default: 0 // Represents time spent in minutes
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
