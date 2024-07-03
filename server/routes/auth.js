const express = require('express')
const router = express.Router()

const { 
  isAuth, 
  loginUser, 
  registerUser, 
  logoutUser,
  verifyEmail, 
  forgotPassword, 
  resetForgotPassword
} = require('../controllers/authController')
const {authenticateUser} = require('../middlewares/authentication')

router
  .get('/', isAuth)
  .post('/register', registerUser)
  .post('/verify-email', verifyEmail)
  .post('/login', loginUser)
  .delete('/logout', authenticateUser, logoutUser)
  .post('/forgot-password', forgotPassword)
  .post('/reset-forgot-password', resetForgotPassword)

module.exports = router