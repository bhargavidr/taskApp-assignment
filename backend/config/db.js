const mongoose = require('mongoose');

const configureDB = async () => { 
    try {
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/taskApp-dec23');
        console.log('Connected to database successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};

// Export the function for use in other parts of your application
module.exports = configureDB