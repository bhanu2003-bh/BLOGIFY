require('dotenv').config({ override: true })

console.log(process.env.PORT)

const express = require("express")
const path = require("path")

const userRouter = require("./routes/user")
const blogRouter = require("./routes/blog")

const cookieParser = require('cookie-parser')
const { checkAuthenticationCookie } = require("./middlewares/authentication")

const Blog = require('./models/blog')
const USER = require('./models/user')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL)
  .then(e => console.log('MongoDb connected'))

const app = express()

app.set('view engine', 'ejs')
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

const PORT = process.env.PORT

app.get('/', async (req, res) => {

  const allBlogs = await Blog.find({})
  try {
    const userData = await USER.findOne({ email: req.user.email })
    const name = userData.fullname
    return res.render("home", {
      user: req.user,
      name: name,
      blogs: allBlogs
    })
  }
  catch {
    return res.render("home", {
      user: req.user,
      blogs: allBlogs
    })
  }
})

app.use('/user', userRouter)
app.use('/blog', blogRouter)

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))