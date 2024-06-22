const { CustomAPIError } = require("../errors/custom-error")
const Token = require("../models/Token")
const { isTokenValid, attachTokenToCookie } = require("../utils/jwt")

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken)
      req.user = payload.user
      return next()
    }

    const payload = isTokenValid(refreshToken)
    const existingToken = await Token.findOne({
      user: payload.user.id,
      refreshToken: payload.refreshToken
    })

    if (!existingToken || !existingToken?.isValid) {
      throw new CustomAPIError('authentication failed, please login', 401)
    }

    req.user = payload.user
    attachTokenToCookie({
      res, 
      user: payload.user,
      refreshToken
    })
  } catch (err) {
    throw new CustomAPIError('authentication failed, please login', 401)
  }
  
  next()
}

const restrictToRoles = (...roles) => {
  return (req, res, next) => {
    const { user } = req
    if (!user) {
      throw new CustomAPIError('please login', 401)
    }

    if (!roles.includes(user.role)) {
      throw new CustomAPIError('no permission to access', 403)
    }

    next()
  }
}

module.exports = {
  authenticateUser,
  restrictToRoles
}