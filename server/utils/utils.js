const crypto = require('crypto')

const createCryptoToken = async (size = 40) => {
  return crypto.randomBytes(size).toString('hex')
}

module.exports = {
  createCryptoToken
}