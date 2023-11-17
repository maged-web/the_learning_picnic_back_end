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
            ]
        }
    ]
}

)

module.exports = mongoose.model("Quiz", quizSchema)
