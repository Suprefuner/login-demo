const express = require('express')
const router = express.Router()
const { loginUser, registerUser, logoutUser, deleteUser } = require('../controllers/authController')
const {authenticateUser} = require('../middlewares/authentication')

router
  .post('/register', registerUser)
  .post('/login', loginUser)
  .delete('/logout', authenticateUser, logoutUser)
  .delete('/delete', authenticateUser, deleteUser)

module.exports = router