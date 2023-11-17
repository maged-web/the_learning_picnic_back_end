const mongoose = require('mongoose');

const modelAnswerSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [
        {
            answerText: {
                type: String,
                required: true
            }
        }
    ]
}
)
module.exports = mongoose.model('ModelAnswer', modelAnswerSchema)