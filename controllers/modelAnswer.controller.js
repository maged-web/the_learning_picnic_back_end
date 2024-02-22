const Quiz = require("../models/quiz.model")
const ModelAnswer = require("../models/modelAnswer.model")
const userAnswers = require("../models/userAnswers.model")
const User = require("../models/user.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")

const deleteModelAnswer = asyncWrapper(async (req, res, next) => {
    const modelAnswerId = req.params.modelAnswerId;
    const modelAnswer = await ModelAnswer.findById(modelAnswerId);
    if (!modelAnswer) {
        const error = appError.create('quiz not found', 400, httpStatusText.FAIL)
        // return next(error)
        return res.status(error.statusCode).json({error})
    }
    else {
        await ModelAnswer.deleteOne({ _id: modelAnswerId })
        return res.json({ status: httpStatusText.SUCCESS, data: null })

    }
});

const getModelAnswer = asyncWrapper(async (req, res, next) => {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
        const error = appError.create('quiz not found', 400, httpStatusText.FAIL)
        // return next(error)
        return res.status(error.statusCode).json({error})
    }

    const userId = req.currentUser.id;

    const modelAnswer = await ModelAnswer.find({ quizId: quizId })
    if (!modelAnswer) {
        const error = appError.create('no model answer found for this quiz', 400, httpStatusText.FAIL)
        // return next(error)
        return res.status(error.statusCode).json({error})
    }

    const user = await User.findById(userId)
    if(user.role === "TEACHER"){
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { modelAnswer: modelAnswer } });

    } else {
        const isQuizAnswered = await userAnswers.findOne({userId : userId})
        if(!isQuizAnswered){
            const error = appError.create('You should take the quiz first', 400, httpStatusText.FAIL)
            // return next(error)
            return res.status(error.statusCode).json({error})
        }
        
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { modelAnswer: modelAnswer } });

    }

});

module.exports = {
    deleteModelAnswer,
    getModelAnswer
}