const express = require("express")
const router = express.Router()
const lessonController = require("../controllers/lesson.controller")
const multer = require("multer");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");
//const blacklist = require("../middleware/blackList")
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
        return cb(appError.create('file must be pdf', 400, false))
}


const upload = multer({ storage: diskStorage, fileFilter })

/* const memoryStorage = multer.memoryStorage();

const memoryUpload = multer({
    storage: memoryStorage,
}); */


router.route("/")
    .post(/* blacklist.isTokenBlacklisted, verifyToken, allowedTo(userRoles.TEACHER),*/ upload.single('pdfFile'), lessonController.uploadLesson)
    .get(lessonController.retrieveLessons)

router.route("/:id")
    .get(lessonController.retrieveLesson)
    .delete(lessonController.deleteLesson)
    .put(upload.single('pdfFile'), lessonController.updateLesson)





module.exports = router