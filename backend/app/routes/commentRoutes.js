const express = require('express');
const router = express.Router();
const validateComment = require('../validations/commentValidation')
const commentCtrl = require('../controllers/CommentCtrl')


// //routes from comments
// router.get('/:id',commentCtrl.getSingleComment);
// // router.get('?createdBy=id',commentCtrl.getSingleUserComment);
// router.post('',validateComment,commentCtrl.create)
// router.put('/:id',commentCtrl.edit);
// router.delete('/:id',commentCtrl.delete);

module.exports = router