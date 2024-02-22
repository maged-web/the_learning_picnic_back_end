const userAnswers = require("../models/userAnswers.model");
const modelAnswer = require ("../models/modelAnswer.model");
const quizResult = require("../models/quizResult.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const Quiz = require("../models/quiz.model");

const submitUserAnswers = asyncWrapper( async(req,res,next) => {
    const quizId = req.params.id;
    const userId = req.currentUser.id;
    const { answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        return res.status(404).json({ status: httpStatusText.FAIL, data: 'Quiz not found' });
    }

    if (quiz.deadline && new Date() > new Date(quiz.deadline)) {
        return res.status(400).json({ status: httpStatusText.FAIL, data: 'Quiz deadline has passed' });
    }

    const check = await userAnswers.findOne({ userId:userId , quizId:quizId });
    if(check){

        const error = appError.create("You already have taken this quiz", 400, httpStatusText.FAIL)
        return res.status(error.statusCode).json({error})
    }

    const newUserAnswers = new userAnswers({
        userId: userId,
        quizId: quizId,
        answers: answers
    })
    await newUserAnswers.save();
    const ModelAnswer = await modelAnswer.findOne({quizId :quizId })
    if(!ModelAnswer){
       const error = appError.create("No model answer found", 400, httpStatusText.FAIL)
         return res.status(error.statusCode).json({error})
    }
     
    const numberOfQuestiosn = ModelAnswer.answers.length;
    let correctAnswers = 0;
     for (let j = 0; j <numberOfQuestiosn; j++) {
        if (ModelAnswer.answers[j].answerText === answers[j]?.answerText) {
            correctAnswers++;
            quiz.questions[j].scorePercentage =
               (((quiz.questions[j].scorePercentage * quiz.questions[j].timesAnswered) + 1) /
                (quiz.questions[j].timesAnswered + 1)) * 100;
                quiz.questions[j].timesAnswered++;
        } else {
            quiz.questions[j].scorePercentage =
                ((quiz.questions[j].scorePercentage * quiz.questions[j].timesAnswered) /
                (quiz.questions[j].timesAnswered + 1)) * 100;
            quiz.questions[j].timesAnswered++;
        }
    }

    const grade = (correctAnswers / numberOfQuestiosn) * 100;

        const quizGrades = [
        {
            quizId: quizId,
            score: grade + "%"
        }
    ];

    const existingUser = await quizResult.findOne({ userId: userId });
    if (existingUser) {
        existingUser.quizGrades.push({ quizId: quizId, score: grade + "%" });
        await existingUser.save();
    } else {
        const newQuizResult = new quizResult({
            userId: userId,
            quizGrades: quizGrades
        });
        await newQuizResult.save();
    }

    await quiz.save();

    res.status(200).json({ status: httpStatusText.SUCCESS, data: {Score : grade} });

});

module.exports ={
    submitUserAnswers
} 