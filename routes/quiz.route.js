const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router.route('/:lessonId')
    .post(verifyToken ,allowedTo(userRoles.TEACHER),quizController.createQuiz)

router.route('/:quizId')
    .delete(verifyToken , allowedTo(userRoles.TEACHER),quizController.deleteQuiz)
    .get(verifyToken,quizController.retrieveQuiz)

router.route('/')
    .get(verifyToken , quizController.retrieveQuizes)

module.exports = router;
