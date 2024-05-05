const express = require('express');
const router = express.Router();


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
//B - added get comments here so if we fetch one task, all comments under that task is also displayed
router.get('/:id',isValidID, taskCtrl.getSingleTask); 
router.put('/:id',isValidID, authLayer.task, taskValidate.update, taskCtrl.updateTask);
router.delete('/:id',isValidID, authLayer.deleteTask, taskCtrl.deleteTask);
router.post('/assignUsers', taskCtrl.assignUsersToTask);



module.exports = router;


