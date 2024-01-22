const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/grade.controller')

router.route('/:quizId/:userId')
    .get(gradeController.getStudentGrade)




module.exports = router