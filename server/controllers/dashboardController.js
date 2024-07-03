const dashboard = (_, res) => {
  res.json({
    success: true,
    message: "here is dashboard"
  })
}

const adminDashboard = (_, res) => {
  res.json({
    success: true,
    message: "here is admin dashboard"
  })
}

module.exports = {
  dashboard,
  adminDashboard
}