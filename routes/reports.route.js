const express = require("express")
const router = express.Router();
const reportController = require("../controllers/reports.controllers")
const allowedTo = require("../middleware/allowedTo")
const userRoles = require("../utils/userRoles")
const verifyToken = require("../middleware/verifyToken")

router.route("/student")
      .get(verifyToken,allowedTo(userRoles.STUDENT),reportController.getStudentReport)

router.route("/parent")
      .get(verifyToken,allowedTo(userRoles.PARENT),reportController.getChildernReports)

router.route("/")
      .get(verifyToken,allowedTo(userRoles.TEACHER),reportController.getALLStudentReports)

router.route("/:quizId")
      .get(verifyToken,allowedTo(userRoles.TEACHER),reportController.getQuizesAnalysis)


module.exports= router;