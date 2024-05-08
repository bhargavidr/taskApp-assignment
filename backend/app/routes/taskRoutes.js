const express = require('express');
const router = express.Router();
const upload = require('../../config/multer')


//contollers
const taskCtrl = require('../controllers/TaskCtrl');
const commentCtrl = require('../controllers/CommentCtrl')

//validations
const taskValidate = require('../validations/taskValidation')
const isValidID = require('../validations/idValidation')

//middleware
const authLayer = require('../middleware/authLayer')

router.get('', taskCtrl.getAllTasks);
router.post('', taskValidate.create, taskCtrl.createTask);
router.get('/:id',isValidID, taskCtrl.getSingleTask); 
router.put('/:id',isValidID, authLayer.task, taskValidate.update, taskCtrl.updateTask);
router.delete('/:id',isValidID, authLayer.deleteTask, taskCtrl.deleteTask);
router.post('/assignUsers', taskCtrl.assignUsersToTask);

//file upload
router.post('/:id/upload', isValidID, authLayer.task, upload.single('file'), taskCtrl.uploadFile);





module.exports = router;


