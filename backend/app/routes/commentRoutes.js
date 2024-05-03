const express = require('express');
const router = express.Router();

const validateComment = require('../validations/commentValidation')
const isValidID = require('../validations/idValidation')

const commentCtrl = require('../controllers/CommentCtrl')

const authLayer = require('../middleware/authLayer')


//routes from comments - /api/comments
// router.get('/:id',isValidID, authLayer.comment ,commentCtrl.getSingleComment);
// router.get('?createdBy=id',commentCtrl.getSingleUserComment);
router.post('',validateComment, commentCtrl.create)
router.put('/:id',isValidID, authLayer.comment, commentCtrl.edit);
router.delete('/:id', isValidID, authLayer.comment, commentCtrl.delete);

module.exports = router