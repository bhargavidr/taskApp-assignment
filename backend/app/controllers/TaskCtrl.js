const Task = require('../models/Task');
const File = require('../models/File')
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
            timeSpent:`00:00:00`,
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
        const { title, description,dueDate,priority,status,assignedTo,timeSpent } = req.body;
        const taskID = req.params.id
        const updatedTask = await Task.findByIdAndUpdate(taskID, {
            title,
            description,
            dueDate,
            priority,
            status,
            assignedTo,
            timeSpent
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
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};


taskCtrl.uploadFile = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        
        // Extract file information
        const title = req.body.title
        const file = req.file.filename

        // Save file information to database
        const newFile = new File({
            title,
            file,
            taskId, 
        });
        await newFile.save();

        res.status(200).json({newFile});
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
};

taskCtrl.getTaskFiles = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const files = await File.find({taskId});

        // console.log(files,'files')
        if (files) {
            res.status(200).json(files);
        }        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


taskCtrl.getFile = async(req,res) => {
    try {
        const { pdf } = req.params;
    
        const file = await File.findOne({ file: pdf });
    
        if (!file) {
          return res.status(404).json({ error: 'File not found' });
        }
    
        res.json(file);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}



module.exports = taskCtrl;
