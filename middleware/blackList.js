/* const httpStatusText = require("../utils/httpStatusText")
const appError = require("../utils/appError")

let blacklistedTokens = [];

function isTokenBlacklisted(req, res, next) {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    const token = authHeader.split(' ')[1]


    if (blacklistedTokens.includes(token)) {
        const error = appError.create("You must log in first", 400, httpStatusText.FAIL)
        return next(error)
    }

    next();
}

function setBlacklistedTokens(tokens) {
    blacklistedTokens.push(tokens)
}

function removeTokenFromBlacklist(token) {
    const index = blacklistedTokens.indexOf(token);
    if (index > -1) {
        blacklistedTokens.splice(index, 1);
    }
};

module.exports = {
    isTokenBlacklisted,
    setBlacklistedTokens,
    removeTokenFromBlacklist
}; */