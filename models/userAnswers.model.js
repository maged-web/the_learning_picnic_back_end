const mongoose = require("mongoose")

const userAnswersSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    
    answers: [
        {
            questionIndex: {
                type: Number,
                required: true
            },
            answerText: {
                type: String,
                required: true
            }
        }
    ]

}
)

module.exports = mongoose.model('userAnswers', userAnswersSchema)