const Quiz = require("../models/quiz.model");
const ModelAnswer = require("../models/modelAnswer.model")
const userAnswers = require("../models/userAnswers.model");
const quizResult = require("../models/quizResult.model");
const Lesson = require("../models/lesson.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const path = require("path");
const { spawn } = require('child_process');

const createQuiz = asyncWrapper(async (req, res, next) => {
    const lessonId = req.params.lessonId;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        const error = appError.create('lesson not found', 400, httpStatusText.FAIL);
        return res.status(400).json({ error });
    }

     const quiz = await Quiz.findOne({lessonId : req.params.lessonId})
     if(quiz){
        const error = appError.create('lesson already has a quiz', 400, httpStatusText.FAIL)
        // return next(error)
        return res.status(error.statusCode).json({ error })
    }

    const lessonName = lesson.name;
    const lessonfile = lesson.pdfFile;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    const pdfPath = path.join(path.join(__dirname, '../uploads'), lessonfile);

    const pythonProcess = spawn('python', ['machine/Quiz_data.py', pdfPath]);

    pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        const prints = output.split('\n');
        const questions_data = prints[0];
        const answers_data = prints[1];
        const questions = JSON.parse(questions_data);
        const answers = JSON.parse(answers_data);

        const newQuiz = new Quiz({
            lessonName: lessonName,
            lessonId: lessonId,
            deadline: deadline,
            questions: questions
        });

        newQuiz.save().then(() => {
            const newModelAnswer = new ModelAnswer({
                quizId: newQuiz._id.toString(),
                answers: answers
            });
            newModelAnswer.save().then(() => {
                res.status(200).json({ status: httpStatusText.SUCCESS, data: { quiz: newQuiz, modelAnswer: newModelAnswer } });
            }).catch((error) => {
                const errorResponse = appError.create("Error saving quiz's model answer", 500, httpStatusText.FAIL);
                res.status(errorResponse.statusCode).json({ error: errorResponse });
            });
        }).catch((error) => {
            const errorResponse = appError.create("Error saving quiz", 500, httpStatusText.FAIL);
            res.status(errorResponse.statusCode).json({ error: errorResponse });
        });
    });

    pythonProcess.stderr.on('data', (data) => {
        const error = appError.create("Error in generating the quiz", 400, httpStatusText.FAIL);
        res.status(error.statusCode).json({ error });
    });
});

const deleteQuiz = asyncWrapper(async (req, res, next) => {
    const quizId = req.params.quizId
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        // return next(error)
        return res.status(error.statusCode).json({ error })
    }
    else {
        await Quiz.deleteOne({ _id: quizId })
        await ModelAnswer.deleteOne({ quizId: quizId })
        await userAnswers.deleteMany({ quizId: quizId })
        await quizResult.updateMany(
            { 'quizGrades.quizId': quizId },
            { $pull: { quizGrades: { quizId: quizId } } }
        )
        return res.json({ status: httpStatusText.SUCCESS, data: null })

    }
});

const retrieveQuiz = asyncWrapper(async (req, res, next) => {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) {
        const error = appError.create('quiz not found', 404, httpStatusText.FAIL)
        // return next(error)
        return res.status(error.statusCode).json({ error })
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
    retrieveQuiz,
    retrieveQuizes,
    // retrieveLessonQuizes
}