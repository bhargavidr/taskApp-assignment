// backend/config/multer.js

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'C:/Users/BHARGAVI BHAT/Documents/MERN course/task-app/backend/uploads');
 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Append timestamp to filename
    }
});

const upload = multer({ storage: storage });

module.exports = upload;