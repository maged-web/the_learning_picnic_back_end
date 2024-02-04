const Quiz = require("../models/quiz.model")
const ModelAnswer = require("../models/modelAnswer.model")
const userAnswers = require("../models/userAnswers.model");
const quizResult = require("../models/quizResult.model");
const Lesson = require("../models/lesson.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")
const spwaner = require("child_process").spawnSync;
 

const createQuiz = asyncWrapper(async (req, res, next) => {
    const lessonId = req.params.lessonId;
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
        return next(error)
    }

    const lessonName = lesson.name
    const lessonfile = lesson.pdfFile

    const pdfPath = path.join(path.join(__dirname, '../uploads'), lessonfile);
    
    const process = spwaner('python',['machine/Quiz_data.py',pdfPath])
    if(process.status==1){
        const error = appError.create("Error in generating the quiz", 404, httpStatusText.FAIL)
        console.log(process.stderr.toString())
        return next(error)
    }
    else {
        output =process.stdout.toString()
         prints = output.split('\n');
         questions_data = prints[0];
         answers_data = prints[1];
         questions = JSON.parse(questions_data)
         answers = JSON.parse(answers_data)
    }

    const newQuiz = new Quiz({
        lessonName: lessonName,
        lessonId: lessonId,
        questions: questions
    })
    await newQuiz.save();

    const newModelAnswer = new ModelAnswer(
    {
            quizId:  newQuiz._id.toString(),
            answers: answers

    })
    await newModelAnswer.save();

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { quiz : newQuiz , modelAnswer: newModelAnswer  } });
    
});

const deleteQuiz = asyncWrapper(async (req, res, next) => {
    const quizId = req.params.quizId
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    else {
        await Quiz.deleteOne({ _id: quizId })
        await ModelAnswer.deleteOne({ quizId : quizId })
        await userAnswers.deleteMany({quizId:quizId})
        await quizResult.updateMany(
            {'quizGrades.quizId' : quizId},
            {$pull:{quizGrades : {quizId : quizId }}}
        )
        return res.json({ status: httpStatusText.SUCCESS, data: null })

    }
});

const retrieveQuiz = asyncWrapper(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    else
        return res.json({ status: httpStatusText.SUCCESS, data: { quiz } })
});

const retrieveQuizes = asyncWrapper(async (req, res, next) => {
    const quiz = await Quiz.find()
    res.json({ status: httpStatusText.SUCCESS, data: { quiz } })
});

// const retrieveLessonQuizes = asyncWrapper(async (req, res, next) => {
//     const lessonId = req.params.lessonId;
//     const lesson = Lesson.findById(lessonId)
//     if (!lesson) {
//         const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
//         return next(error)
//     }
//     const quizes = await Quiz.find({ lessonId: lessonId })
//     console.log(quizes)
//     if (!quizes) {
//         const error = appError.create('no quizes found for this lesson', 404, httpStatusText.FAIL)
//         return next(error)
//     }
//     else
//         return res.json({ status: httpStatusText.SUCCESS, data: { quizes } })
// })


module.exports = {
    createQuiz,
    deleteQuiz,
    retrieveQuize,
    retrieveQuizes,
    // retrieveLessonQuizes
}