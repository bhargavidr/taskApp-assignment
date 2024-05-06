const Comment = require('../models/Comment');
const Task = require('../models/Task');

const commentCtrl = {};

// Create a new comment
commentCtrl.create= async (req, res) => {
    try {
        const { taskId, text } = req.body;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const comment = new Comment({
            taskId,
            text,
            createdBy: {id: req.user._id, username:req.user.username},
            createdAt: new Date() // Assuming the authenticated user is creating the comment
        });

        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get comments for a task
commentCtrl.getCommentsByTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const comments = await Comment.find({ taskId : taskId });
        res.json(comments);
        //can have req.comments = comments and passed in getSingleTask api (for later)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a comment
commentCtrl.edit = async (req, res) => {
    try {
        const commentId = req.params.id;
        const { text } = req.body;

        const comment = await Comment.findByIdAndUpdate(commentId, { text }, { new: true });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a comment
commentCtrl.delete = async (req, res) => {
    try {
        const commentId = req.params.id;

        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = commentCtrl;