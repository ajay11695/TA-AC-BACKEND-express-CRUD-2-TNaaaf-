var mongoose=require('mongoose')
var Schema=mongoose.Schema

var bookSchema= new Schema({
    title:{type:String,required:true},
    summary:{type:String},
    pages:Number,
    publication:String,
    categories:[String],
    cover_image:String,
    authorName:String,
    authorId:{type:Schema.Types.ObjectId,ref:'Author'}
},{
    timestamps:true
})

module.exports=mongoose.model('Book',bookSchema)