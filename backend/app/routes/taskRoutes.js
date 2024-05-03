const express = require('express');
const router = express.Router();


//contollers
const taskCtrl = require('../controllers/TaskCtrl');
const commentCtrl = require('../controllers/commentCtrl')

//validations
const taskValidate = require('../validations/taskValidation')

router.get('', taskCtrl.getAllTasks);
router.post('', taskCtrl.createTask);
//B - added get comments here so if we fetch one task, all comments under that task is also displayed
router.get('/:id',taskValidate.isValidID,commentCtrl.getTaskComments, taskCtrl.getSingleTask); 
router.put('/:id',taskValidate.isValidID, taskValidate.update, taskCtrl.updateTask);
router.delete('/:id', taskValidate.isValidID, taskCtrl.deleteTask);



module.exports = router;


