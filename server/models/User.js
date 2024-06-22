const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Token = require('./Token')

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: [true, "must have email"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide valid email"]
  },
  role: {
    type: String, 
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "must have password"],
    minlength: [4, "can't shorter than 4 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "must confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password
      }
    }
  },
  passwordLastChangedAt: Date
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.post('findOneAndDelete', async function () {
  const userToken = await Token.findOneAndDelete({
    user: this.getQuery()._id
  })
  console.log(`${userToken} is removed`);
})

userSchema.methods.comparePassword = async (
  inputPassword,
  userPassword
) => {
  return await bcrypt.compare(inputPassword, userPassword)
}

userSchema.methods.hasChangedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordLastChangedAt) {
    return this.passwordLastChangedAt > jwtTimestamp
  }
  return false
}

module.exports = mongoose.model('User', userSchema)