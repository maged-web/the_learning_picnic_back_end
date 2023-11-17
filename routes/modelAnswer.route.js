const express = require('express');
const router = express.Router();
const modelAnswerController = require('../controllers/modelAnswer.controller')

router.route('/:quizId')
    .post(modelAnswerController.createModelAnswer)

router.route('/:modelAnswerId')
    .delete(modelAnswerController.deleteModelAnswer)

router.route('/:lessonId/:quizId')
    .get(modelAnswerController.getModelAnswer)

module.exports = router