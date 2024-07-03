const crypto = require('crypto')

const { 
  sendVerificationEmail, 
  sendResetPasswordEmail
} = require('./emailController');

const { 
  attachTokenToCookie, 
  isTokenValid, 
  removeTokenFromCookie
} = require('../utils/jwt')
const { createCryptoToken } = require('../utils/utils')
const { getDayInMs } = require('../utils/datetime');

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnauthenticatedError
} = require("../errors/custom-error");

const User = require("../models/User");

const isAuth = async (req, res) => {
  const { refreshToken, accessToken } = req.signedCookies

  const errorResponse = () => {
    return res.status(200).json({
      success: true,
      user: null
    })
  }
  
  // access token (X) & refresh token (X)
  if (!accessToken && !refreshToken) {
    return errorResponse()
  }

  // access token (X) but refresh token (O)
  if (!accessToken) {
    let refreshPayload = isTokenValid(refreshToken)

    // QUESTION: should I remove it? since the token is invalid
    if (!refreshPayload) {
      // removeTokenFromCookie(res, 'refreshToken')
      return errorResponse()
    }

    // make sure the user is still exist in db
    const user = await User.findById(refreshPayload.user.id)
    if (!user) {
      return errorResponse()
    }

    const tokenUser = {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }

    // QUESTION: reuse the same refresh token should be fine? i think is okay? since we double checked the user still exist in db.
    // after thought, I should reuse since if I keep updating the refresh token, it will never expire
    attachTokenToCookie({
      res,
      user: tokenUser,
      refreshToken: refreshPayload.refreshToken
    })

    return res.status(200).json({
      success: true,
      user: tokenUser
    })
  }

  // access token (O) but refresh token (O)
  // QUESTION: even I verify refresh token would be the same? since they both contain the same payload. Or I should always verify the access token over refresh token?
  let accessPayload = isTokenValid(accessToken)

  if (!accessPayload) {
    // removeTokenFromCookie(res, 'accessToken')
    errorResponse()
  }

  res.status(200).json({
    success: true,
    user: accessPayload.user
  })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('please provide email and password to login')
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new NotFoundError("User can't find, please try again.")
  }

  const isPasswordCorrect = await user.comparePassword(password, user.password)

  if (!isPasswordCorrect) {
    throw new BadRequestError("please input correct email or password ")
  }

  if (!user.isVerified) {
    throw new BadRequestError("please check your verify email and verify first")
  }

  const tokenUser = {
    id: user._id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified
  }

  let refreshToken = crypto.randomBytes(40).toString('hex')

  attachTokenToCookie({
    res,
    user: tokenUser,
    refreshToken
  })

  res.status(200).json({
    success: true,
    message: "login successful",
    user: tokenUser
  });
}

const registerUser = async (req, res) => {
  const {
    email,
    password,
    passwordConfirm,
  } = req.body

  // define the first user always as admin
  const isFirstUser = !!!await User.countDocuments({})
  const verificationToken = await createCryptoToken()

  const user = await User.create({
    email,
    role: isFirstUser ? 'admin' : 'user',
    password,
    passwordConfirm,
    verificationToken
  })

  await sendVerificationEmail({
    to: user.email,
    verificationToken: user.verificationToken
  })

  res.status(201).json({
    success: true,
    message: "registration success. Verification email is sent, please check your email",
  })
}

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body
  if (!email || !verificationToken) {
    throw new BadRequestError('missing email or verification token')
  }

  const user = await User.findOne({
    email,
    verificationToken
  })

  if (!user) {
    throw new NotFoundError("user doesn't exist")
  }

  user.isVerified = true
  user.verifiedDate = Date.now()
  user.verificationToken = ''
  await user.save()

  res.status(200).json({
    success: true,
    message: 'user verified, please login'
  })
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new UnauthorizedError('missing email, please try again')
  }

  const user = await User.findOne({ email })

  // prevent hacker knows what email in our db
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'reset password email sent, please check your mailbox'
    })
  }

  const resetToken = await createCryptoToken()
  user.resetPasswordToken = resetToken
  user.resetPasswordTokenExpireDate = Date.now() + getDayInMs(7)

  await user.save()

  await sendResetPasswordEmail({
    resetToken,
    to: email
  })

  res.status(200).json({
    success: true,
    message: 'reset password email sent, please check your mailbox'
  })
}

const resetForgotPassword = async (req, res) => {
  const { resetToken, email, password, passwordConfirm } = req.body

  if (!resetToken || !email || !password || !passwordConfirm) {
    throw new UnauthorizedError('missing required fields, please try again')
  }

  if (password !== passwordConfirm) {
    throw new UnauthorizedError('confirm password is not the same as password, please try again')
  }

  const user = await User.findOne({
    email,
    resetPasswordToken: resetToken
  })

  if (!user) {
    throw new NotFoundError('user not found')
  }

  const isTokenExpire = user.resetPasswordTokenExpireDate < Date.now()

  if (isTokenExpire) {
    // QUESTION: 第一次寫係打算expire左就再自動send多次email俾佢, 但諗諗下都係直接show error message好啲, 因為有機會會俾人chur爆個email service?
    throw new UnauthenticatedError('reset token expired')
  }

  user.password = password
  await user.save()

  res.status(200).json({
    success: true,
    message: 'password updated, please login'
  })
}

const logoutUser = async (req, res) => {
  removeTokenFromCookie(res, 'accessToken')
  removeTokenFromCookie(res, 'refreshToken')

  res.status(200).json({
    success: true,
    message: 'logout success'
  })
}

module.exports = {
  isAuth,
  registerUser,
  verifyEmail,
  forgotPassword,
  resetForgotPassword,
  loginUser,
  logoutUser,
}