const Lesson = require("../models/lesson.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")
const path = require("path")
const fs = require("fs")
const spwaner = require("child_process").spawnSync;


const uploadLesson = asyncWrapper(async (req, res, next) => {

    const { name } = req.body;

    if (!name || !req.file) {
        const error = appError.create("name and pdf file reuired", 400, httpStatusText.FAIL)
        return next(error)
    }

    const pdfFile = req.file.originalname;
    const existingPdf = await Lesson.findOne({ pdfFile });
    if(existingPdf){
        const error = appError.create("Lesson already uploaded", 400, httpStatusText.FAIL)
        return next(error)
    }

    const newLesson = new Lesson (
        {
            name,
            pdfFile: pdfFile

        } 
    )

    await newLesson.save()
    const lesson = await Lesson.findById(newLesson._id.toString());
    const pdfPath = path.join(path.join(__dirname, '../uploads'), lesson.pdfFile);

    const process = spwaner('python',['machine/Summary.py',pdfPath])
    if(process.status==1){
        const error = appError.create("Error in generating the quiz", 404, httpStatusText.FAIL)
        return next(error)
    }
    else {
        output =process.stdout.toString()
        summary = output
    }
    if(summary){
        lesson.summary = summary
    }
    await lesson.save();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { lesson: newLesson } })

});

const retrieveLessons = asyncWrapper(async (req, res, next) => {
    const lesson = await Lesson.find()
    res.json({ status: httpStatusText.SUCCESS, data: { lesson } })

});

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
});

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
}));

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

const downloadLesson = asyncWrapper(async (req,res,next) => {

    const lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
        return next(error)
    }

    const filePath = path.join(__dirname, '../uploads', lesson.pdfFile);
    console.log(filePath)

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            const error = appError.create('pdf file not found', 404, httpStatusText.FAIL)
            return next(error)
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${lesson.pdfFile}`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

});

module.exports =
{
    uploadLesson,
    retrieveLessons,
    retrieveLesson,
    deleteLesson,
    updateLesson,
    downloadLesson
}