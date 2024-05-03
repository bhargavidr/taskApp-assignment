const express = require('express');
const router = express.Router();
const validateComment = require('../validations/commentValidation')
const commentCtrl = require('../controllers/commentCtrl')


//routes from comments
router.get('/:id',commentCtrl.getSingleComment);
router.get('?createdBy=id',commentCtrl.getSingleUserComment);
router.post('',validateComment,commentCtrl.create)
router.put('/:id',commentCtrl.edit);
router.del('/:id',commentCtrl.delete);

module.exports = router