const express = require("express")
const router = express.Router()
const lessonController = require("../controllers/lesson.controller")
const multer = require("multer");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");
const appError = require("../utils/appError")

const diskStorage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
            /*   const name = file.mimetype.split("/")[0]
              const ext = file.mimetype.split("/")[1]; */
            const fileName = file.originalname/* `${name}.${ext}` */
            cb(null, fileName)
        },

    }
)
const fileFilter = (req, file, cb) => {
    const pdfType = file.mimetype.split("/")[1];
    if (pdfType === 'pdf') {
        return cb(null, true)
    }
    else
        return cb(appError.create('file must be pdf', 404, false))
}


const upload = multer({ storage: diskStorage, fileFilter })

/* const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
    storage: memoryStorage,
}); */


router.route("/")
    .post(verifyToken,allowedTo(userRoles.TEACHER),upload.single('pdfFile'), lessonController.uploadLesson)
    .get(verifyToken,lessonController.retrieveLessons)

router.route("/:id")
    .get(verifyToken,lessonController.retrieveLesson)
    .delete(verifyToken,allowedTo(userRoles.TEACHER),lessonController.deleteLesson)
    .put(allowedTo(userRoles.TEACHER),upload.single('pdfFile'), lessonController.updateLesson)




module.exports = router