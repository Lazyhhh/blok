var express = require('express')
var router = express.Router()
var User = require('./models/users')
var Article = require('./models/articles')
var md5 = require('blueimp-md5')

router.get('/',function (req, res) {
  res.render('index.html', {
    user: req.session.user,
    articles: req.session.articles
  })
})

router.get('/login',function (req, res) {
  res.render('login.html')
})

router.post('/login',function (req, res) {
  var body = req.body
  body.password = md5(md5(body.password))
  User.findOne({
    email: body.email,
    password: body.password
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
    if (!user) {
      res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }
    req.session.user = user
    res.status(200).json({
      err_code: 0,
      massage: 'OK'
    })
  })
})

router.get('/register',function (req, res) {
  res.render('register.html')
})

router.post('/register',function (req, res) {
  var body = req.body
  User.findOne({
    $or: [
      {
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  },function (err, data) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: '服务器错误'
      })
    }

    if (data) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
    }

    body.password = md5(md5(body.password))
    new User(body).save(function (err, user) {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Internal error.'
        })
      }
      req.session.user = user
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })
    })
  })
})

router.get('/logout',function (req, res) {
  delete req.session.user
  res.redirect('/')
})

router.get('/topic/new',function (req, res) {
  res.render('topic/new.html',{
    user: req.session.user
  })
})

router.post('/topic/new',function (req, res) {
  var body = req.body
  new Article(body).save(function (err) {
    if (err) {
      res.render('404.html')
    }
    Article.find(function (err, articles) {
      if (err) {
        res.render('404.html')
      }
      req.session.articles = articles
      res.redirect('/')
    })
  })
})

module.exports = router