const jwt = require('jsonwebtoken')
const { getMinInMs, getDayInMs } = require('./datetime')

const createUserToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET)
};

const setCookie = ({res, name, payload, expires}) => {
  res.cookie(name, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    sameSites: 'Strict',
    expires,
  });
}

const attachTokenToCookie = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createUserToken({ user });
  const refreshTokenJWT = createUserToken({ user, refreshToken });

  const accessPeriod = getMinInMs(15); // 15 mins
  const refreshPeriod = getDayInMs(process.env.JWT_COOKIE_EXPIRES_IN) // 1 month

  setCookie({
    res,
    name: 'accessToken',
    payload: accessTokenJWT,
    expires: new Date(Date.now() + accessPeriod)
  })

  setCookie({
    res,
    name: 'refreshToken',
    payload: refreshTokenJWT,
    expires: new Date(Date.now() + refreshPeriod)
  })
};



const removeTokenFromCookie = (res, cookieName) => {
  res.cookie(cookieName, '', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
}

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
  createUserToken, 
  attachTokenToCookie, 
  removeTokenFromCookie,
  isTokenValid
}