const { 
  UnauthorizedError, 
  UnauthenticatedError
} = require("../errors/custom-error")
const { isTokenValid } = require("../utils/jwt")

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies

  if (!refreshToken && !accessToken) {
    throw new UnauthenticatedError()
  }

  try {
    let payload = isTokenValid(accessToken || refreshToken)
    req.user = payload.user
  } catch (err) {
    throw new UnauthenticatedError()
  }

  next()
}

const restrictToRoles = (...roles) => {
  return async (req, res, next) => {
    const { id } = req.params
    const { user: currentUser } = req
    
    // QUESTION: should I keep this logic? redundant?
    // if (!currentUser) {
    //   throw new CustomAPIError('please login', 401)
    // }

    // me(X) && role(X) 
    if (!roles.includes('me') && !roles.includes(currentUser.role)) {
      throw new UnauthorizedError()
    }

    // only that user could perform this action
    if (roles.includes('me') && roles.length === 1) {
      if (currentUser.id !== id) {
        throw new UnauthorizedError()
      }
    }

    // both that user or specific role can perform
    if (roles.includes('me') && roles.length > 1) {
      const isMe = currentUser.id === id
      const isIncludedRole = roles.includes(currentUser.role)

      if (!isMe && !isIncludedRole) {
        throw new UnauthorizedError()
      }
    }

    next()
  }
}

module.exports = {
  authenticateUser,
  restrictToRoles,
}