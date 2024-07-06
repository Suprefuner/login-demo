class CustomAPIError extends Error{
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class UnauthorizedError extends CustomAPIError{
  constructor(message) {
    super(message || 'no permission', 403)
  }
}

class UnauthenticatedError extends CustomAPIError{
  constructor(message) {
    super(message || 'authentication failed, please login', 401)
  }
}

class NotFoundError extends CustomAPIError{
  constructor(message) {
    super(message || 'data not found', 404)
  }
}

class BadRequestError extends CustomAPIError{
  constructor(message) {
    super(message || 'please provide required data', 400)
  }
}

module.exports = {
  CustomAPIError,
  UnauthorizedError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError
}