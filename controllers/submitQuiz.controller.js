const SubmitedQuiz = require("../models/submitQuiz.model")
const ModelAnswer = require("../models/modelAnswer.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")
const Grade = require("../models/grade.model")
const QuizModel = require("../models/quiz.model")

const submitQuiz = asyncWrapper(async (req, res, next) => {
    const quizId = req.params.id;
    const userId = req.currentUser.id;
    const { answers } = req.body

    const Check = await SubmitedQuiz.findOne({ userId: userId, quizId: quizId })
    if (Check) {
        return res.status(400).json({ status: httpStatusText.FAIL, data: 'you only have one chance ' });

    }

    const newSubmit = new SubmitedQuiz({
        userId: userId,
        quizId: quizId,
        answers: answers

    })
    await newSubmit.save();
    const modelAnswer = await ModelAnswer.findOne({ quizId: quizId });


    let score = 0;
    const totalQuestions = modelAnswer.answers.length;

    for (let i = 0; i < totalQuestions; i++) {
        if (modelAnswer.answers[i].answerText === answers[i]?.answerText) {
            score++;
        }
    }
    const grade = (score / totalQuestions) * 100;

    res.status(200).json({ status: httpStatusText.SUCCESS, data: 'Sbmited successflly', Score: grade });

    const studentScore = [
        {
            quizId: quizId,
            score: grade + "%"
        }
    ]

    const submitedBefore = await Grade.findOne({ userId: userId });
    if (submitedBefore) {

        submitedBefore.studendScores.push({ quizId: quizId, score: grade + "%" });
        await submitedBefore.save()
    }
    else {
        const newGrade = new Grade({
            userId: userId,
            studendScores: studentScore
        })

        await newGrade.save();
    }

})


const getQuizAnswers = asyncWrapper(async (req, res, next) => {
    const quizId = req.params.id;
    const quiz = await QuizModel.findById(quizId)
    if (!quiz) {
        return res.status(400).json({ status: httpStatusText.FAIL, data: 'No quiz found ' });
    }
    const QuizAnswersData = await SubmitedQuiz.find({ quizId: quizId });

    if (QuizAnswersData.length === 0) {
        return res.status(400).json({ status: httpStatusText.FAIL, data: 'No sumbited Occur' });

    }
    return res.status(200).json({ status: httpStatusText.SUCCESS, data: QuizAnswersData });

})



module.exports = {
    submitQuiz,
    getQuizAnswers,
}