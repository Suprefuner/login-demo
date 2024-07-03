const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    required: true,
  },
  password: {
    type: String,
    required: [true, "must have password"],
    minlength: [4, "can't shorter than 4 characters"],
    select: false,
  },
  passwordLastChangedAt: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String, 
    select: false
  },
  verifiedDate: Date,
  resetPasswordToken: {
    type: String, 
    select: false
  },
  resetPasswordTokenExpireDate: Date,
  active: {
    type: Boolean, 
    default: true
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  this.password = await bcrypt.hash(this.password, 12)

  if (this.isVerified) return next()

  this.passwordLastChangedAt = Date.now()
  next()
})

userSchema.methods.comparePassword = async (
  inputPassword,
  userPassword
) => (
  await bcrypt.compare(inputPassword, userPassword)
)

module.exports = mongoose.model('User', userSchema)