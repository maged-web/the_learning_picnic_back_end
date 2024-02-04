const express = require('express');
const router = express.Router();
const modelAnswerController = require('../controllers/modelAnswer.controller');
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");


router.route('/:modelAnswerId')
    .delete(verifyToken , allowedTo(userRoles.TEACHER) , modelAnswerController.deleteModelAnswer)

router.route('/:quizId')
    .get(verifyToken , modelAnswerController.getModelAnswer)

module.exports = router