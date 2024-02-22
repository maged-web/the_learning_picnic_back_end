require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const path = require("path")
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


const mongoose = require("mongoose")

const httpStatusText = require("./utils/httpStatusText")


mongoose.connect(process.env.URL).then(() => {
    console.log("connected to database successfully")
})

const userRoute = require("./routes/user.route")
const lessonRouter = require("./routes/lesson.route")
const quizRouter = require("./routes/quiz.route")
const modelRouter = require("./routes/modelAnswer.route")
const AnswersRouter = require("./routes/userAnswers.route")
const reportRouter = require("./routes/reports.route")

app.use("/users", userRoute)
app.use("/lessons", lessonRouter)
app.use("/quizes", quizRouter)
app.use("/modelAnswer", modelRouter)
app.use("/Answers",AnswersRouter)
app.use("/report",reportRouter)


app.all('*', (req, res) => {
    return res.status(404).json({ status: httpStatusText.ERROR, msg: 'this resource is not avaliable', code: 404 })
})

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: error.statusText || httpStatusText.ERROR, code: error.statusCode || 500, data: null })
})
app.listen(process.env.PORT, () => {
    console.log("server is running on port 2222 successfully")
})