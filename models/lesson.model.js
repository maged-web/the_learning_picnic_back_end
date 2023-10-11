const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true

        },
        pdfFile:
        {
            type: String,
            default: ''
        },
        /* fileData:
        {
            type: Buffer
        } */
    }
)
module.exports = mongoose.model("Lesson", lessonSchema)