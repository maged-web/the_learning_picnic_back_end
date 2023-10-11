const mongoos = require("mongoose")
const validator = require('validator')
const userRoles = require("../utils/userRoles")
const userSchema = new mongoos.Schema({
    firstName:
    {
        type: String,
        required: true
    },
    lastName:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'filed must be a valid email adress']
    },
    phone:
    {
        type: String,
        required: true,
        unique: true,
    },
    password:
    {
        type: String,
        required: true,
    },
    token:
    {
        type: String,
    },
    role:
    {
        type: String,
        enum: [userRoles.ADMIN, userRoles.STUDENT, userRoles.TEACHER, userRoles.PARENT],
        default: userRoles.STUDENT

    },
})
module.exports = mongoos.model('User', userSchema)