const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const quizResult = require("../models/quizResult.model");
const User = require("../models/user.model");
const Quiz = require("../models/quiz.model");

const getStudentReport = asyncWrapper(async(req,res,next)=>{

    const userId = req.currentUser.id;
    const {LessonName} = req.query
    if(LessonName){
        const report = await quizResult.findOne({
            userId: userId,
            'quizGrades.LessonName': { $regex: new RegExp(LessonName, 'i') } },{ 'quizGrades.$': 1})
        if(!report){
        const error = appError.create("No avaliable results for this student now",400,httpStatusText.FAIL)
          return res.status(error.statusCode).json({error})
        }
     res.status(200).json({status:httpStatusText.SUCCESS , data :{report}})
    }
    const report = await quizResult.findOne({userId:userId});
    if(!report){
        const error = appError.create("No avaliable results for this student now",400,httpStatusText.FAIL)
        return res.status(error.statusCode).json({error})
    }
    res.status(200).json({status:httpStatusText.SUCCESS , data :{report}})
});

const getChildernReports = asyncWrapper(async(req,res,next)=>{
    
    const parentId = req.currentUser.id;
    const childernEmail = await User.findById(parentId).select('childernEmails');
    const emails = childernEmail.childernEmails;
    const userId = [];

    for (const email of emails){
        const id = await User.findOne({email : email}).select('_id');
        userId.push(id)
    }

    const reports = await quizResult.find({ userId: { $in: userId } });
    if(!reports){
        const error = appError.create("No reports found",400,httpStatusText.FAIL)
        return res.status(error.statusCode).json({error})

    }
    res.status(200).json({status:httpStatusText.SUCCESS , data : {reports}})
});

const getALLStudentReports = asyncWrapper(async(req,res,next)=>{
    const reports = await quizResult.find();
    if(!reports){
        const error = appError.create("No reports found",400,httpStatusText.FAIL)
        return res.status(error.statusCode).json({error})
    }
    res.status(200).json({status : httpStatusText.SUCCESS , data : {reports}})

});

const getQuizesAnalysis = asyncWrapper(async(req,res,next)=>{
    const quizId = req.params.quizId
    const report = await Quiz.findById(quizId).select('lessonName questions.questionText questions.scorePercentage questions.timesAnswered')
    if(!report){
        const error = appError.create("No report for this quiz",400,httpStatusText.SUCCESS)
        return res.status(error.statusCode).json({error})
    }
    res.status(200).json({status:httpStatusText.SUCCESS , data : {report}})

});

module.exports = {
    getStudentReport,
    getChildernReports,
    getALLStudentReports,
    getQuizesAnalysis
}