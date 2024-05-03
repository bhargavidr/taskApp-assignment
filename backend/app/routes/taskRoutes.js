const express = require('express');
const router = express.Router();


//contollers
const taskCtrl = require('../controllers/TaskCtrl');
const commentCtrl = require('../controllers/CommentCtrl')

//validations
const taskValidate = require('../validations/taskValidation')
const isValidID = require('../validations/idValidation')

router.get('', taskCtrl.getAllTasks);
router.post('', taskValidate.create, taskCtrl.createTask);
//B - added get comments here so if we fetch one task, all comments under that task is also displayed
router.get('/:id',isValidID, taskCtrl.getSingleTask); 
router.put('/:id',isValidID, taskValidate.update, taskCtrl.updateTask);
router.delete('/:id',isValidID, taskCtrl.deleteTask);



module.exports = router;


