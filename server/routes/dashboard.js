const express = require('express')
const router = express.Router()

const {authenticateUser, restrictToRoles} = require('../middlewares/authentication')
const { dashboard, adminDashboard } = require('../controllers/dashboardController')

router
  .get('/', authenticateUser, dashboard)
  .get('/admin', authenticateUser, restrictToRoles('admin'), adminDashboard)

module.exports = router