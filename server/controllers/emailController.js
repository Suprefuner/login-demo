const transporter = require('../utils/nodemailerConfig')

const sendEmail = async ({ to, subject, content }) => {
  await transporter.sendMail({
    from: '"Login-demo" <joe@gmail.com>',
    to,
    subject,
    html: content
  });
}

const sendVerificationEmail = async({ verificationToken, to }) => {
  const content = `
    <h1>Hi, welcome to login-demo.</h1>

    <p>please click below link to verify.</p>

    <a href="http://localhost:5173/user/verify?email=${to}&token=${verificationToken}" target="_blank">
      click to verify
    </a>
  `

  return sendEmail({
    to, 
    subject: 'Welcome to login-demo',
    content
  })
}

const sendResetPasswordEmail = async ({ resetToken, to }) => {
  const content = `
  <p>please click below link to reset your password.</p>

  <a href="http://localhost:5173/reset?email=${to}&token=${resetToken}" target="_blank">
    click to reset your password
  </a>
`

  return sendEmail({
    to,
    subject: 'Reset password on login-demo',
    content
  })
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail
}