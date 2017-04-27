const express = require('express');
const path = require('path');
const fs = require('fs');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const AdminsMetier = require('./metiers/AdminsMetier');
const SessionMetier = require('./metiers/SessionMetier');

const index = require('./routes/index');
const profile = require('./routes/profil');
const admin = require('./routes/admin');
const admin_search = require('./routes/admin_search');
const personRessource = require('./routes/api/personRessource');

const mongoose   = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/server_sympozer'); // connect to our database

//Check if we have a default admin account
new AdminsMetier().setDefaultAdminAccount();

const app = express();

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
  res.locals.session = req.session;
  return next();
});

/* Middleware to check if user can access to profile page */
app.all('(/profile/*)|(/profile)', function(req,res,next){
  if(!req.session.user_id || req.session.is_admin === undefined || req.session.is_admin !== false){
    SessionMetier.destroy(req.session)
      .then(function(){
        return res.redirect("/");
      })
      .catch(function(){
        return res.redirect("/");
      });
  }
  else {
    return next();
  }
});

/* Middleware to check if user can access to admin page */
app.all('(/admin/*)|(/admin)', function(req,res,next){
  if(!req.session.user_id || req.session.is_admin === undefined || req.session.is_admin !== true){
    SessionMetier.destroy(req.session)
      .then(function(){
        return res.redirect("/");
      })
      .catch(function(){
        return res.redirect("/");
      });
  }
  else{
    return next();
  }
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
app.use('/admin', admin);
app.use('/admin/search', admin_search);
app.use('/api', personRessource);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
