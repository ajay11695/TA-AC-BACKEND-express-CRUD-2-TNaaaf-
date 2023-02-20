


var mongoose=require('mongoose')
var Schema=mongoose.Schema

var commentSchema=new Schema({
    content:{type:String,required:true},
    bookId:{type:Schema.Types.ObjectId,ref:"article",required:true},
    author:String,
    likes:{type:Number,default:0}
},{
    timestamps:true
})

module.exports=mongoose.model('Comment',commentSchema)