const express = require('express');
const router = express.Router();
const { checkSchema, check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware')

//contollers
const taskCtrl = require('../controllers/TaskCtrl');

//validations
const taskValidate = require('../validations/taskValidation')

router.get('', taskCtrl.getAllTasks);
router.post('', taskCtrl.createTask);
router.get('/:id',taskValidate.isValidID, taskCtrl.getSingleTask);
router.put('/:id',taskValidate.isValidID, taskValidate.update, taskCtrl.updateTask);
router.delete('/:id', taskValidate.isValidID, taskCtrl.deleteTask);

module.exports = router;


