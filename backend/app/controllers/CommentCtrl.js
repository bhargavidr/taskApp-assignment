const Comment = require('../models/Comment');
const Task = require('../models/Task');

const commentCtrl = {};

// Create a new comment
commentCtrl.createComment = async (req, res) => {
    try {
        const { taskId, content } = req.body;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const comment = new Comment({
            task: taskId,
            content,
            createdBy: req.user._id // Assuming the authenticated user is creating the comment
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
        const comments = await Comment.find({ task: taskId });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a comment
commentCtrl.updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { content } = req.body;

        const comment = await Comment.findByIdAndUpdate(commentId, { content }, { new: true });

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
commentCtrl.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;

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