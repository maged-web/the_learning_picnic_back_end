const mongoose = require("mongoose");
const gradeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        studendScores: [
            {
                quizId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Quiz',
                    required: true
                },
                score: {
                    type: String,
                    required: true
                }
            }
        ]
    }
)
module.exports = mongoose.model("Grade", gradeSchema)