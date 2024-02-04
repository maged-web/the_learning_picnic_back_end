const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema ({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    quizGrades : [
        {
            quizId :{
                type : mongoose.Schema.Types.ObjectId,
                ref :'Quiz',
                required : true
            },
            score :{
                type : String,
                required : true
            }
        }
    ]
})

module.exports = mongoose.model('quizResult', resultSchema);