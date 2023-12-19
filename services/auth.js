const jwt=require("jsonwebtoken")

const secret="Vikas@123"

function createTokenForUser(user){
  const payload={
    name:user.name,
    email:user.email,
    password:user.password,
    role:user.role
  }
  return jwt.sign(payload,secret)
}

function validateToken(token){
  const payload=jwt.verify(token,secret)
  return payload
} 

module.exports={
  createTokenForUser,validateToken
}