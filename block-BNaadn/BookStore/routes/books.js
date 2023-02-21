var express = require('express');
var multer=require('multer')
var fs=require('fs')

var router = express.Router();
var Books=require('../model/Book')
var Author=require('../model/Author');


// const upload = multer({ dest: "public/images" });
//Configuration for Multer
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
  
    cb(null, Date.now() + file.originalname);
  },
});

var upload=multer({storage:storage})

/* GET book listing. */
router.get('/', (req, res, next)=> {
  Books.find({},(err,books)=>{
    if(err)return next(err)
    res.render('bookstore',{ books:books });

  })
});

// create book form
router.get('/new',(req,res)=>{
  res.render('createBook')
})

// create book
router.post('/',upload.single('cover_image'),(req,res,next)=> {
  req.body.cover_image=req.file.filename.trim()
  req.body.categories=req.body.categories.trim().split(' ')
  Author.create(req.body,(err,author)=>{
    if(err)return next(err)
    req.body.authorId=author._id
        Books.create(req.body,(err,book)=>{
        if(err)return next(err)
        Author.findOneAndUpdate({authorName:book.authorName},{$push:{bookId:book._id}},{new:true},(err,author)=>{
          if(err)return next(err)
          console.log(book,author)
          res.redirect('/books')
        })
      })
    })
})

// serach book
router.post('/search',(req,res,next)=>{
  console.log(req.body)
  Books.find({title:req.body.book},(err,books)=>{
    if(err)return next(err)
    console.log(books)
    res.render('bookstore',{ books })
  })
})

// search book from category
router.post('/category',(req,res,next)=>{
  console.log(req.body)
  Books.find({categories:{$in:[req.body.category]}},(err,books)=>{
    if(err)return next(err)
    console.log(books)
    res.render('bookstore',{ books })
  })
})

// fetcing book
router.get('/:id',(req,res,next)=>{
  var id=req.params.id
  // Books.findById(id,(err,book)=>{
  //   Author.findById(book.authorId,(err,author)=>{

  //     console.log(author,book)
  //   })
  // })

  Books.findById(id).populate('authorId').exec((err,book)=>{
    if(err)return next(err)
    res.render('bookDetail',{ book })
  })
})

// edit book
router.get('/:id/edit',(req,res,next)=>{
  var id =req.params.id
  Books.findById(id).populate('authorId').exec((err,book)=>{
    if(err)return next(err)
    book.categories=book.categories.join(' ')
    res.render('editbook',{ book })
  })
})

// update book
router.post('/:id',upload.single('cover_image'),(req,res,next)=>{
  var id =req.params.id 
  let file = req.file
  let prev_Image = req.body.cover_image

  let new_image = ''

  if(file){
    new_image = req.file.filename;
    try {
      
      //delete th old img
      fs.unlinkSync('./public/images/'+prev_Image)
    } catch (error) {
      console.log(error)
    }
  }else{
    new_image = prev_Image
  }
  req.body.cover_image = new_image
  req.body.categories=req.body.categories.trim().split(' ')

  Books.findByIdAndUpdate(id,req.body,(err,ubook)=>{
    if(err)return next(err)
    Author.findByIdAndUpdate(ubook.authorId,req.body,(err,author)=>{
      // Books.findById(id).populate('authorId').exec((err,book)=>{
      //   console.log(book)
      //   res.redirect('/books/' + id)
      // })
      if(err) return next(err)
      res.redirect('/books/'+ id)
    })
 
  })

})

// delete book
router.get('/:id/delete',(req,res,next)=>{
  var id =req.params.id
  Books.findByIdAndDelete(id,req.body,(err,deleteBook)=>{
    Author.findByIdAndDelete(deleteBook.authorId,(err,author)=>{
      if(deleteBook.cover_image !==''){
        try {
          fs.unlinkSync('./public/images/' + deleteBook.cover_image)
        } catch (error) {
          console.log(error)
        }
      }else{
        res.redirect('/books')
      }
      if(err)return next(err)
      res.redirect('/books')
    })
  })
})

// search bar

module.exports = router;

