const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    title:String,
    file:String,
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task', // Reference to the Task model
        required: true
    }
})

const File = mongoose.model('file',fileSchema)

module.exports = File