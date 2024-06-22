const jwt = require('jsonwebtoken')

const createUserToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET)
};

const attachTokenToCookie = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createUserToken({ user });
  const refreshTokenJWT = createUserToken({ user, refreshToken });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    // expires: new Date(Date.now() + oneDay),
    maxAge: 1000 * 60 * 15,
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
  createUserToken, 
  attachTokenToCookie, 
  isTokenValid
}