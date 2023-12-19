const {Router}=require('express')

const User=require('../models/user')

const router=Router()

router.get("/signup",(req,res)=>{
  return res.render("signup")
})

router.get("/signin",(req,res)=>{
  return res.render("signin")
})

router.post("/signin",async(req,res)=>{
  try{
    const {email,password}=req.body
    const token=await User.matchPasswordAndGenerateToken(email,password)
    return res.cookie("token",token).redirect("/")
  }
  catch{
    return res.render("signin",{
      error:'Incorrect email or password'
    })
  }
})

router.post("/signup",async(req,res)=>{
  const {fullname,email,password}=req.body
  await User.create({
    fullname:fullname,
    email:email,
    password:password
  })
  return res.redirect("/")
})

router.get("/logout",(req,res)=>{
  res.clearCookie('token').redirect("/")
})

module.exports=router
