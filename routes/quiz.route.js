const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router.route('/:lessonId')
    .post(verifyToken ,allowedTo(userRoles.TEACHER),quizController.createQuiz)
    // .get(quizController.retrieveLessonQuizes)

router.route('/:quizId')
    .delete(verifyToken , allowedTo(userRoles.TEACHER),quizController.deleteQuiz)

router.route('/:id')
    .get(verifyToken , quizController.retrieveQuiz)


router.route('/')
    .get(verifyToken , quizController.retrieveQuizes)

module.exports = router;
