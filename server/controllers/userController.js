const { NotFoundError, UnauthenticatedError } = require("../errors/custom-error")
const User = require("../models/User")

const getAllUsers = async (req, res) => {
  const users = await User.find()

  res.status(200).json({
    success: true, 
    users
  })
}

const updateUser = async (req, res) => {
  const { id: userId } = req.params
  const user = await User.findById(userId)

  if (!user) {
    throw NotFoundError('User not find')
  }

  let updatedUser

  // since the only thing I could update is the role
  if (user.role === 'admin') {
    updatedUser = user
  } else {
    user.role = 'admin'
    updatedUser = await user.save()
  }

  res.status(200).json({
    success: true, 
    user: updatedUser
  })
}

const resetPassword = async (req, res) => {
  const { id } = req.params
  const { password, passwordConfirm } = req.body

  if (!password || !passwordConfirm) {
    throw new UnauthenticatedError('missing required information, please try again')
  }

  if (password !== passwordConfirm) {
    throw new UnauthenticatedError('confirm password is not the same as password, please try again')
  }

  const user = await User.findById(id)

  if (!user) {
    throw new NotFoundError('user not found')
  }

  user.password = password
  await user.save()

  // will logout the current user and ask them to login again
  removeTokenFromCookie(res, 'accessToken')
  removeTokenFromCookie(res, 'refreshToken')

  res.status(200).json({
    success: true,
    message: 'password updated, please login'
  })
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)

  if (!user) {
    throw new NotFoundError("User not found")
  }

  user.active = false
  await user.save()

  res.status(200).json({
    success: true,
    message: "user deleted",
  })
}

module.exports = {
  getAllUsers,
  updateUser,
  resetPassword,
  deleteUser
}