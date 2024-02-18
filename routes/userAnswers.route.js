const express = require("express")
const router = express.Router();
const userAnswersController = require("../controllers/userAnswers.controller");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router.route('/:id')
    .post(verifyToken,allowedTo(userRoles.STUDENT), userAnswersController.sumbitUserAnswers)

module.exports = router;