const Task = require('../models/Task');
// const { validationResult } = require('express-validator')
const createTask = require('../validations/createTaskValidation')
const taskCtrl = {};

// Function to get all tasks
taskCtrl.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy : req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

taskCtrl.getSingleTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        // if(task.createdBy == req.user.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task); //B - do res.json(task, req.comments)
    } catch (err) {
        // console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


// Function to create a new task
taskCtrl.createTask = async (req, res) => {
    try {
        const {error, value} = createTask.validate(req.body);
        // console.log(error,'error object')
        // console.log(value, 'value object')
    if (error) {
        return res.status(400).json(error.details);
        //console.log(error)
    }
        const { title, description, dueDate, priority, status } = req.body;
        const newTask = new Task({
            title,
            description,
            dueDate: dueDate,
            priority,
            status,
            createdBy: req.user.id
        });
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
        const { title, description,dueDate,priority,status } = req.body;
        const taskID = req.params.id
        const updatedTask = await Task.findByIdAndUpdate(taskID, {
            title,
            description,
            dueDate,
            priority,
            status,
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
