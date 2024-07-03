class CustomAPIError extends Error{
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class UnauthorizedError extends CustomAPIError{
  constructor(message) {
    this.message = message || 'no permission'
    this.statusCode = 403
  }
}

class UnauthenticatedError extends CustomAPIError{
  constructor(message) {
    this.message = message || 'authentication failed, please login'
    this.statusCode = 401
  }
}

class NotFoundError extends CustomAPIError{
  constructor(message) {
    this.message = message
    this.statusCode = 404
  }
}

class BadRequestError extends CustomAPIError{
  constructor(message) {
    this.message = message
    this.statusCode = 400
  }
}

module.exports = {
  UnauthorizedError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError
}