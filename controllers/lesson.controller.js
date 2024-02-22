const Lesson = require("../models/lesson.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")
const path = require("path")
const fs = require("fs")
const { spawn } = require('child_process');

const uploadLesson = asyncWrapper(async (req, res, next) => {
    const { name } = req.body;

    if (!name || !req.file) {
        const error = appError.create("name and pdf file required", 400, httpStatusText.FAIL);
        return res.status(error.statusCode).json({ error });
    }

    const pdfFile = req.file.originalname;
    const existingPdf = await Lesson.findOne({ pdfFile });
    if (existingPdf) {
        const error = appError.create("Lesson already uploaded", 400, httpStatusText.FAIL);
        return res.status(error.statusCode).json({ error });
    }

    const newLesson = new Lesson({
        name,
        pdfFile: pdfFile
    });

    await newLesson.save();

    const lesson = await Lesson.findById(newLesson._id.toString());
    const pdfPath = path.join(path.join(__dirname, '../uploads'), lesson.pdfFile);
    
    const pythonProcess = spawn('python', ['machine/Summary.py', pdfPath]);

    pythonProcess.stdout.on('data', (data) => {
        const summary = data.toString(); // Assuming summary comes as stdout from the Python script
        lesson.summary = summary;
        lesson.save().then(() => {
            res.status(200).json({ status: httpStatusText.SUCCESS, data: { lesson: newLesson } });
        }).catch((error) => {
            const errorResponse = appError.create("Error saving lesson with summary", 500, httpStatusText.FAIL);
           return res.status(errorResponse.statusCode).json({ errorResponse });
        });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        const error = appError.create("Error in generating the summary", 404, httpStatusText.FAIL);
       return res.status(error.statusCode).json({ error });
    });
});

const retrieveLessons = asyncWrapper(async (req, res, next) => {
    const lesson = await Lesson.find()
    res.json({ status: httpStatusText.SUCCESS, data: {lesson} })

});

const retrieveLesson = asyncWrapper(async (req, res, next) => {
    const lesson = await Lesson.findById(req.params.id)
    if (!lesson) {
        const error = appError.create('lesson not found', 404, httpStatusText.FAIL)
          // return next(error)
          return res.status(error.statusCode).json({error})
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
        // return next(error)
        return res.status(error.statusCode).json({error})
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
        const error = appError.create('Lesson not found', 400, httpStatusText.FAIL);
         // return next(error)
         return res.status(error.statusCode).json({error})
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
        const error = appError.create('lesson not found', 400, httpStatusText.FAIL)
         // return next(error)
         return res.status(error.statusCode).json({error})
    }

    const filePath = path.join(__dirname, '../uploads', lesson.pdfFile);
    console.log(filePath)

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            const error = appError.create('pdf file not found', 404, httpStatusText.FAIL)
           // return next(error)
        return res.status(400).json({error})
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
    updateLesson
}