var express = require('express');
var path = require('path');
const fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

var index = require('./routes/index');
var profile = require('./routes/profil');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/server_sympozer'); // connect to our database


var app = express();

/* Check if upload folder exist */
try {
  fs.statSync("./public/uploads");
} catch(e) {
  fs.mkdirSync("./public/uploads");
}

/* Use to manage session */
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));

//Middleware session
app.use(function(req,res,next){
  res.locals.user_id = req.session.user_id;
  return next();
});

/* Middleware to check if user can access to profile page */
app.all('(/profile/*)|(/profile)', function(req,res,next){
  if(!req.session.user_id){
    return res.redirect('/');
  }
  return next();
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.use('/', index);
app.use('/profile', profile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
