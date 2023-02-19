var mongoose=require('mongoose')
var Schema=mongoose.Schema

var articleSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    tags:[String],
    author:String,
    likes:Number
},{
    timestamps:true
})

module.exports=mongoose.model('aricle',articleSchema)