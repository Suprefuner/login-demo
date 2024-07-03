const express = require('express')
const router = express.Router()

const { authenticateUser, restrictToRoles } = require('../middlewares/authentication')
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController')
const { resetPassword } = require('../controllers/userController')

router
  .get('/all', authenticateUser, restrictToRoles('admin'), getAllUsers)
  .patch('/:id', authenticateUser, restrictToRoles('admin'), updateUser)
  .patch('/reset-password/:id', authenticateUser, restrictToRoles('me'), resetPassword)
  .delete('/:id', authenticateUser, restrictToRoles(
    'me', 'admin'), deleteUser)

module.exports = router