var express = require('express');
const article = require('../model/article');
var router = express.Router();
var articles=require('../model/article')

/* GET article listing. */
router.get('/',(req,res,next)=>{
  articles.find({},req.body,(err,articles)=>{
    if(err)return next()
    res.render('listArticle.ejs',{articles:articles})
  })
})

// created article form

router.get('/new',(req,res)=>{
  res.render('createArticle')
})

// ctreated article

router.post('/',(req,res,next)=>{
  console.log(req.body)
  req.body.tags=req.body.tags.trim().split(' ')

  articles.create(req.body,(err,createArticle)=>{
    if(err)return next()
    res.redirect('/articles')
    console.log(createArticle)
  })
})

// fetching single article

router.get('/:id',(req,res,next)=>{
  var id=req.params.id
  articles.findById(id,req.body,(err,articleDetail)=>{
    if(err)return next()
    res.render('articleDetail',{articleDetail})
  })
})

// edit article

router.get('/:id/edit',(req,res,next)=>{
  
  articles.findById(req.params.id,(err,article)=>{
    article.tags=article.tags.join(' ')
    res.render('updateArticle',{article})
  })
})

// update article

router.post('/:id',(req,res,next)=>{
  var id =req.params.id
  req.body.tags=req.body.tags.trim().split(' ')
  articles.findByIdAndUpdate(id,req.body,{new:true},(err,update)=>{
    if(err)return next(err)
    res.redirect('/articles/' + id)
  })
})

// delete article

router.get('/:id/delete',(req,res)=>{
  articles.findByIdAndDelete(req.params.id,req.body,(err,article)=>{
    res.redirect('/articles')
  })
})

// increment likes

router.get('/:id/likes',(req,res,next)=>{
  var id =req.params.id
  articles.findByIdAndUpdate(id,{$inc:{likes:1}},(err,updatelikes)=>{
    if(err)return next(err)
    res.redirect('/articles/' + id)
  })
})

module.exports = router;
