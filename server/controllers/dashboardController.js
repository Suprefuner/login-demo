const jwt = require('jsonwebtoken')

const dashboard = (req, res) => {
  res.json({
    success: true,
    message: "here is dashboard"
  })
}

const adminDashboard = (req, res) => {
  res.json({
    success: true,
    message: "here is admin dashboard"
  })
}



module.exports = {
  dashboard,
  adminDashboard
}