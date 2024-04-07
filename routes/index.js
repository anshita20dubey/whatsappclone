var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const groupModel = require('./group');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

router.get('/',isLoggedIn, async function(req, res, next) {
  // console.log(req.user); // agr req.user use krna h to isloggedin me likha hona chahiye
  res.render('index', { user: req.user});
});

router.get('/register',  function(req,res,next){
  res.render('register');
});
router.get('/login',  function(req,res,next){
  res.render('login');
});

router.post('/register', function (req, res, next) {
  const userData = new userModel({
    username: req.body.username,
    contact: req.body.contact,
  })
  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect('/');
    })
  })
});

router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
}), function (req, res, next) { })

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

module.exports = router;
