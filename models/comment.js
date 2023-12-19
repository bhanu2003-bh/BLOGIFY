const mongoose=require('mongoose')

const commentSchema=new mongoose.Schema({
  content:{
    type:String,
    required:true,
  },
  blogId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"blog"
  },
  userEmail:{
    type: String,
  },
  userName:{
    type: String,
  },
})

const Comment=mongoose.model('comment',commentSchema)

module.exports=Comment