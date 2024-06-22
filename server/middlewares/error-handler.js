const { CustomAPIError } = require('../errors/custom-error')

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  let statusCode = 500
  let errorMessage = 'Something went wrong, please try again.'

  if (err instanceof CustomAPIError) {
    statusCode = err.statusCode
    errorMessage = err.message
  }

  return res.status(statusCode).json({ msg: errorMessage, err })
}

module.exports = errorHandlerMiddleware