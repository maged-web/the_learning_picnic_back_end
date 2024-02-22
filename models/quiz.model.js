const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({

    lessonName: {
        type: String,
        required: true
    },
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    questions: [
        {
            questionText:
            {
                type: String,
                required: true
            },
            choices: [
                {
                    choiceText: {
                        type: String,
                        required: true
                    }
                },
                {
                    choiceText: {
                        type: String,
                        required: true
                    }
                },
                {
                    choiceText: {
                        type: String,
                        required: true
                    }
                },
                {
                    choiceText: {
                        type: String,
                        required: true
                    }
                }
            ],
            scorePercentage: {
                type: Number,
                default: 1
            },
            timesAnswered: {
                type: Number,
                default: 0
            },
        }
    ]
});

module.exports = mongoose.model("Quiz", quizSchema)
