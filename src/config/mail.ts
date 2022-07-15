require('dotenv').config()

const user = process.env.EMAIL_USER

const password = process.env.EMAIL_PASSWORD

const domain = process.env.DOMAIN

const version = process.env.VERSION

const method = {
  register: 'register',
  resetPassword: 'resetPassword'
}

const link = {
  register: `${domain}/${version}/api/auth/verify`,
  resetPassword: `${domain}/${version}/api/auth/reset-password`
}

const mail = {
  user,
  password,
  method,
  link
}

export default mail
