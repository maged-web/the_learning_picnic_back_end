const Quiz = require("../models/quiz.model")
const Lesson = require("../models/lesson.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")

const createQuiz = asyncWrapper(async (req, res, next) => {
    const lessonId = req.params.lessonId;
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    const lessonName = lesson.name
    const questions = [
        {
            questionText: 'What is 2 + 2?',
            choices: [
                { choiceText: '3' },
                { choiceText: '4' },
                { choiceText: '5' },
                { choiceText: '6' }
            ]
        },
        {
            questionText: 'What is the 1 + 1?',
            choices: [
                { choiceText: '2' },
                { choiceText: '8' },
                { choiceText: '9' },
                { choiceText: '10' }
            ]
        }
    ];
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);

    const newQuiz = new Quiz({
        lessonName: lessonName,
        lessonId: lessonId,
        deadline: deadline,
        questions: questions
    })
    await newQuiz.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { quiz: newQuiz } });


}
)

const deleteQuiz = asyncWrapper(async (req, res, next) => {
    //const lessonId=req.params.lessonId
    const quizId = req.params.quizId
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    else {
        await Quiz.deleteOne({ _id: quizId })
        return res.json({ status: httpStatusText.SUCCESS, data: null })

    }
}

)

const retrieveQuize = asyncWrapper(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    else
        return res.json({ status: httpStatusText.SUCCESS, data: { quiz } })
})

const retrieveQuizes = asyncWrapper(async (req, res, next) => {
    const quiz = await Quiz.find()
    res.json({ status: httpStatusText.SUCCESS, data: { quiz } })
})

const retrieveLessonQuizes = asyncWrapper(async (req, res, next) => {
    const lessonId = req.params.lessonId;
    const lesson = Lesson.findById(lessonId)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    const quizes = await Quiz.find({ lessonId: lessonId })
    console.log(quizes)
    if (!quizes) {
        const error = appError.create('no quizes found for this lesson', 404, httpStatusText.FAIL)
        return next(error)
    }
    else
        return res.json({ status: httpStatusText.SUCCESS, data: { quizes } })
})



module.exports = {
    createQuiz,
    deleteQuiz,
    retrieveQuize,
    retrieveQuizes,
    retrieveLessonQuizes
}