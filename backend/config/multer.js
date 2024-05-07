// backend/config/multer.js

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Upload files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Append timestamp to filename
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
