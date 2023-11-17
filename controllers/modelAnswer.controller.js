const Quiz = require("../models/quiz.model")
const ModelAnswer = require("../models/modelAnswer.model")
const Lesson = require("../models/lesson.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")

const createModelAnswer = asyncWrapper(async (req, res, next) => {

    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        return next(error)
    }

    const answers = [
        {
            answerText: '4'
        },
        {
            answerText: '2'
        }
    ];
    const newModelAnswer = new ModelAnswer(
        {
            quizId: quizId,
            answers: answers

        }
    )
    await newModelAnswer.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { quiz: newModelAnswer } });

})
const deleteModelAnswer = asyncWrapper(async (req, res, next) => {
    const modelAnswerId = req.params.modelAnswerId;
    const modelAnswer = await ModelAnswer.findById(modelAnswerId);
    if (!modelAnswer) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    else {
        await ModelAnswer.deleteOne({ _id: modelAnswerId })
        return res.json({ status: httpStatusText.SUCCESS, data: null })

    }
})
const getModelAnswer = asyncWrapper(async (req, res, next) => {
    const lessonId = req.params.lessonId
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        return next(error)
    }

    const modelAnswer = await ModelAnswer.find({ quizId: quizId })
    if (!modelAnswer) {
        const error = appError.create('no model answer found for this quiz', 404, httpStatusText.FAIL)
        return next(error)
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { modelAnswer: modelAnswer } });



})

module.exports = {
    createModelAnswer,
    deleteModelAnswer,
    getModelAnswer
}