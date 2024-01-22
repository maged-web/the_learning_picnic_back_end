const Grade = require("../models/grade.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")
const SubmitedQuiz = require("../models/submitQuiz.model")
const ModelAnswer = require("../models/modelAnswer.model")
const Quiz = require("../models/quiz.model")
const UserModel = require("../models/user.model")
const GradeModel = require("../models/grade.model")


const getStudentGrade = asyncWrapper(async (req, res, next) => {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId)
    const userId = req.params.userId
    const user = await UserModel.findById(userId)
    if (!quiz) {
        return res.status(400).json({ status: httpStatusText.FAIL, data: 'No quiz found ' });

    }
    if (!user) {
        return res.status(400).json({ status: httpStatusText.FAIL, data: 'No user found ' });
    }
    const userAnswers = await GradeModel.find({ userId: userId })
    const filteredObjects = [];



    userAnswers.forEach(item => {
        for (let j = 0; j < item.studendScores.length; j++) {
            if (item.studendScores[j].quizId.toString() === quizId) {
                filteredObjects.push(item.studendScores[j]);
            }
        }
    });

    const theAnswers = await SubmitedQuiz.find({ userId: userId, quizId: quizId })
    return res.status(200).json({ status: httpStatusText.SUCCESS, grade: filteredObjects[0].score, answers: theAnswers[0].answers });

})

module.exports = {
    getStudentGrade
}