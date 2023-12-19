const { Schema, model } = require('mongoose')
const { randomBytes, createHmac } = require('crypto')
const { createTokenForUser } = require('../services/auth')

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    //required: true
  },
  password: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String,
    default: './public/images/user-avatar.jpg'
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  }
}, { timestamps: true })


userSchema.pre("save", function (next) {

  const user = this
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString()

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password).digest("hex")

  this.salt = salt
  this.password = hashedPassword
  next()
})

userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
  const user=await this.findOne({email})

  if(!user) throw new Error('User not found')

  const salt=user.salt
  const hashedPassword=user.password

  const providedPassword=createHmac("sha256", salt)
  .update(password).digest("hex")

  if(providedPassword!==hashedPassword) throw new Error('Incorrect password')

  const token=createTokenForUser(user)
  return token
})


const User = model("user", userSchema)

module.exports = User