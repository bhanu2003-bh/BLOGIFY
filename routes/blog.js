const { Router } = require('express')

const USER = require('../models/user')
const BLOG = require('../models/blog')
const COMMENT = require('../models/comment')

const express = require('express')
const path = require('path')
const multer = require("multer")
const Blog = require('../models/blog')



const router = Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/uploads")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage })

router.get("/add-blog", async (req, res) => {
  try {
    const userData = await USER.findOne({ email: req.user.email })
    const name = userData.fullname
    return res.render("add-blog", {
      user: req.user,
      name: name
    })
  }
  catch {
    return res.render("add-blog", {
      user: req.user,
    })
  }
})


router.post("/add-blog", upload.single('coverImage'), async (req, res) => {
  const { title, body } = req.body
  const userData = await USER.findOne({ email: req.user.email })

  const blog = await BLOG.create({
    title: title,
    body: body,
    coverImageURL: `uploads/${req.file.filename}`,
    createdBy: userData._id
  })

  return res.redirect(`/blog/${blog._id}`)
})

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
    const userData = await USER.findOne({ email: req.user.email })
    const name = userData.fullname
    const createdUser = await USER.findOne({ _id: blog.createdBy })

    const allComments=await COMMENT.find({})

    return res.render("blog", {
      blog: blog,
      user: req.user,
      name: name,
      createdUser: createdUser,
      allComments:allComments
    })
  }
  catch {
    res.render("signin")
  }
})


router.post("/comment/:blogId", async (req, res) => {

  const commentedUser=await USER.findOne({email:req.user.email})
  
  await COMMENT.create({
    content: req.body.content,
    blogId: req.params.blogId,
    userEmail:req.user.email,
    userName:commentedUser.fullname
  })

  return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router