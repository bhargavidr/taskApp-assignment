require('dotenv').config();

const express = require('express');
const cors = require('cors');
const configureDB = require('./config/db');

// Importing routes, controllers, and middleware
const taskRoutes = require('./app/routes/taskRoutes');
const userRoutes = require('./app/routes/userRoutes');
const commentRoutes = require('./app/routes/commentRoutes')


const authMiddleware = require('./app/middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());
app.use('./uploads',express.static('files'))

// Connect to the database
configureDB();

// Routes
app.use('/api/tasks', authMiddleware.authenticateUser, taskRoutes); // Task management routes with authentication middleware
app.use('/api/users', userRoutes); // User management routes
app.use('/api/comments',authMiddleware.authenticateUser, commentRoutes) //comments controller

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});