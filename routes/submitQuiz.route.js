const express = require("express")
const router = express.Router()
const submitQuizController = require("../controllers/submitQuiz.controller")
const verifyToken = require("../middleware/verifyToken")

router.route('/:id')
    .post(verifyToken, submitQuizController.submitQuiz)
    .get(submitQuizController.getQuizAnswers)


module.exports = router