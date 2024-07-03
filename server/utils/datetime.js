const getDayInMs = (day) => {
  const oneDay = 1000 * 60 * 60 * 24
  return oneDay * day
}

const getMinInMs = (min) => {
  const oneMin = 1000 * 60
  return oneMin * min
}

module.exports = {
  getDayInMs,
  getMinInMs
}