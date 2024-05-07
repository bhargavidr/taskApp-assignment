const Task = require('../models/Task');
// const { validationResult } = require('express-validator')
const taskCtrl = {};

// Function to get all tasks
taskCtrl.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { createdBy: { id: req.user.id, username: req.user.username } },
                { "assignedTo": { $in: [req.user.id] } }
            ]
        });
        
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

taskCtrl.getSingleTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task); 
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


// Function to create a new task
taskCtrl.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, assignedTo } = req.body;
        const newTask = new Task({
            title,
            description,
            dueDate: dueDate,
            assignedTo,
            priority,
            status,
            createdBy: {id: req.user.id, username: req.user.username},
        });
        // console.log(newTask)
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Function to update a task
taskCtrl.updateTask = async (req, res) => {
    try {
        const { title, description,dueDate,priority,status,assignedTo } = req.body;
        const taskID = req.params.id
        const updatedTask = await Task.findByIdAndUpdate(taskID, {
            title,
            description,
            dueDate,
            priority,
            status,
            assignedTo
        }, { new: true });
        
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Function to delete a task
taskCtrl.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id, { new: true });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully', deleted: task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

taskCtrl.assignUsersToTask = async (req, res) => {
    try {
        const { taskId, userIds } = req.body;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.assignedUsers = userIds; // Assign array of user IDs to the task
        await task.save();

        res.json({ message: 'Users assigned to task successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = taskCtrl;
