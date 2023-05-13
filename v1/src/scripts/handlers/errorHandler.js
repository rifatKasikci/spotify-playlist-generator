const { ErrorResult } = require('../utils/results')
const { BaseError } = require('../utils/errors')

class ErrorHandler {
    handleError(err, res) {
        return res.status(err.httpCode).json(new ErrorResult(err.description))
    }

    isTrustedError(error) {
        if (error instanceof BaseError) {
            return error.isOperational;
        }
        return false;
    }
}
const errorHandler = new ErrorHandler();
module.exports = errorHandler
