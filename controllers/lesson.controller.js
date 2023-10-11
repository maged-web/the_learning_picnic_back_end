const Lesson = require("../models/lesson.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")

const uploadLesson = asyncWrapper(async (req, res, next) => {

    const { name } = req.body;

    if (!name || !req.file) {
        const error = appError.create("name and pdf file reuired", 400, httpStatusText.FAIL)
        return next(error)
    }

    const newLesson = new Lesson(
        {
            name,
            pdfFile: req.file.originalname,
            /*fileData: req.file.buffer*/
        }
    )
    await newLesson.save()
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { lesson: newLesson } })

})
const retrieveLessons = asyncWrapper(async (req, res, next) => {
    const lesson = await Lesson.find()
    res.json({ status: httpStatusText.SUCCESS, data: { lesson } })

})
const retrieveLesson = asyncWrapper(async (req, res, next) => {
    const lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    else
        return res.json({ status: httpStatusText.SUCCESS, data: { lesson } })


    /*   const lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
           const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
           return next(error)
       }
       else
                  res.set('Content-Type', 'application/pdf')
                  res.send(lesson.fileData) */
})
const deleteLesson = (asyncWrapper(async (req, res, next) => {
    const lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
        return next(error)
    }
    else {
        await Lesson.deleteOne({ _id: req.params.id })
        return res.json({ status: httpStatusText.SUCCESS, data: null })

    }
}))

const updateLesson = asyncWrapper(async (req, res, next) => {
    /*  let lesson = await Lesson.findById(req.params.id);
   
       if (!lesson) {
           const error = appError.create('Lesson not found', 404, httpStatusText.FAIL);
           return next(error);
       }
 
     if (req.file) {
         const updated = await Lesson.updateOne({ _id: req.params.id }, { $set: { ...req.body, pdfFile: req.file.originalname } })
         return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updated } })
 
     }
     else {
         const updated = await Lesson.updateOne({ _id: req.params.id }, { $set: { ...req.body } })
         return res.status(200).json({ status: httpStatusText.SUCCESS, data: { updated } })
 
     } */

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
        const error = appError.create('Lesson not found', 404, httpStatusText.FAIL);
        return next(error);
    }

    const { name } = req.body;

    if (req.file) {
        lesson.pdfFile = req.file.originalname;
    }
    if (name)
        lesson.name = name;

    // Save the updated lesson
    await lesson.save();

    res.json({ status: httpStatusText.SUCCESS, data: { lesson } });
});
module.exports =
{
    uploadLesson,
    retrieveLessons,
    retrieveLesson,
    deleteLesson,
    updateLesson
}