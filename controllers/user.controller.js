const User = require("../models/user.model")
const asyncWrapper = require("../middleware/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")
const bcrypt = require("bcryptjs")
const generateJWT = require("../utils/generateJWT")
/* const blacklist = require("../middleware/blackList")
 */

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, role } = req.body
    const oldUser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
    if (oldUser) {
        const error = appError.create("User already exists", 400, httpStatusText.FAIL)
        return next(error)
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(
        {
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role,
        }
    )
    const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role })
    newUser.token = token;

    await newUser.save()
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { user: newUser } })


})

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = appError.create("email and password are required", 400, httpStatusText.FAIL)
        next(error);
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = appError.create("user not found", 400, httpStatusText.FAIL)
        return next(error)
    }
    const matchedPassword = await bcrypt.compare(password, user.password)
    if (user && matchedPassword) {
        const token = await generateJWT({ email: user.email, id: user._id, role: user.role })
        res.status(200).json({ status: httpStatusText.SUCCESS, data: { token } })
        //blacklist.removeTokenFromBlacklist(token)

    }
    else {
        const error = appError.create("something wroung", 500, httpStatusText.ERROR)
        return next(error)
    }
})


/* const logout = (req, res,) => {
    // const token = req.headers['Authorization'] || req.headers['authorization'] 
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    const token = authHeader.split(' ')[1]

    if (!token) {
        const error = appError.create("Token is missing from the request", 500, httpStatusText.ERROR)
        return next(error)
    }

    blacklist.setBlacklistedTokens(token)
    res.status(200).json({ status: httpStatusText.SUCCESS, data: 'Logged out successfully' })

} */
module.exports = {
    register,
    login,
    //logout
}