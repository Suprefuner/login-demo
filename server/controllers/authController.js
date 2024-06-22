const crypto = require('crypto')

const {
  createUserToken,
  attachTokenToCookie,
  isTokenValid
} = require('../utils/jwt')
const User = require("../models/User");
const Token = require("../models/Token");

const { CustomAPIError } = require("../errors/custom-error");

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomAPIError('please provide email and password to login', 400)
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    throw new CustomAPIError("User can't find, please try again.", 404)
  }

  const isPasswordCorrect = await user.comparePassword(password, user.password)

  if (!isPasswordCorrect) {
    throw new CustomAPIError("please input correct email or password ", 400)
  }

  const tokenUser = {
    id: user._id,
    email: user.email,
    role: user.role
  }

  let refreshToken = ''
  const existingToken = await Token.findOne({ user: user._id })
  
  if (existingToken) {
    if (!existingToken.isValid) {
      throw new CustomAPIError("invalid token, please login", 400)
    }

    refreshToken = existingToken.refreshToken
  } else {
    refreshToken = crypto.randomBytes(40).toString('hex')

    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = {
      refreshToken,
      ip,
      userAgent,
      user: user._id
    }
  
    await Token.create(userToken)
  }

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
    role,
    password,
    passwordConfirm,
    passwordLastChangedAt
  } = req.body

  const user = await User.create({
    email,
    role,
    password,
    passwordConfirm,
    passwordLastChangedAt
  })

  user.password = undefined

  res.status(201).json({
    success: true,
    message: "register success, please login",
  })
}

const logoutUser = async (req, res) => {
  await Token.findOneAndDelete({user: req.user.id})

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(200).json({
    success: true,
    message: 'logout success'
  })
}

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user.id)

  res.status(200).json({
    success: true, 
    message: "user deleted",
  })
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser
}