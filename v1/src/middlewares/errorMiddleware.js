const errorHandler = require('../scripts/handlers/errorHandler')
require('dotenv').config()

const errorMiddleware = async (err, req, res, next) => {
    if (!errorHandler.isTrustedError(err)) {
        next(err)
    }
    return errorHandler.handleError(err, res)
}

module.exports = errorMiddleware 


