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
const UserMetier = require('./metiers/UserMetier');
const VotesMetier = require('./metiers/VotesMetier');
const UserAuthorizeToVoteMetier = require('./metiers/UserAuthorizeToVoteMetier');

const app = express();

let baseUrl = '/';
if (app.get('env') === "production") {
  baseUrl = '/external/';
}

console.log(baseUrl);

//Middleware baseurl
app.use(function (req, res, next) {
  res.locals.baseurl = baseUrl;
  return next();
});

app.set('baseurl', baseUrl);

const index = require('./routes/index');
const profile = require('./routes/profil');
const admin = require('./routes/admin');
const admin_search = require('./routes/admin_search');
const personRessource = require('./routes/api/personRessource');
const auth = require('./routes/api/auth');
const vote = require('./routes/api/vote');
const user = require('./routes/api/user');

//Check if we have a default admin account
const adminMetier = new AdminsMetier();
const userMetier = new UserMetier();
const votesMetier = new VotesMetier();
const userAuthorizeToVoteMetier = new UserAuthorizeToVoteMetier();

//adminMetier.removeAllVote();
adminMetier.removeAdminAccount("root@root.com");
adminMetier.setDefaultAdminAccount("lionel.medini@liris.cnrs.fr", "lionelmedini0987");
adminMetier.setDefaultAdminAccount("pierre.mmarsot@gmail.com", "pierremmarsot0987");

/*let emails = ["lionel.medini@univ-lyon1.fr"];

function authorizeUserEmail(emails){
  return new Promise((resolve, reject) => {
    if(!emails || emails.length === 0){
      return reject();
    }

    const email = emails[0];
    emails.splice(0, 1);

    userAuthorizeToVoteMetier.add(email)
      .then(() => {
        return resolve(authorizeUserEmail(emails));
      })
      .catch(() => {
        return resolve(authorizeUserEmail(emails));
      });
  });
}

authorizeUserEmail(emails);*/

//remove vote medini
/*userMetier.getByEmail("lionel.medini@univ-lyon1.fr")
  .then((mediniUser) => {
    if (!mediniUser) {
      return false;
    }

    votesMetier.removeAllByIdUser(mediniUser._id);
  });*/

//Clear database
//adminMetier.removeAllDocuments();

/* Check if upload folder exist */
try {
  fs.statSync("./public/uploads");
} catch (e) {
  fs.mkdirSync("./public/uploads");
}

/* Use to manage session */
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: true}));

//Middleware session
app.use(function (req, res, next) {
  res.locals.session = req.session;
  return next();
});

/* Middleware to check if user can access to profile page */
app.all('(/profile/*)|(/profile)', function (req, res, next) {
  if (!req.session.user_id || req.session.is_admin === undefined || req.session.is_admin !== false) {
    SessionMetier.destroy(req.session)
      .then(function () {
        return res.redirect(req.app.get('baseurl'));
      })
      .catch(function () {
        return res.redirect(req.app.get('baseurl'));
      });
  }
  else {
    return next();
  }
});

/* Middleware to check if user can access to admin page */
app.all('(/admin/*)|(/admin)', function (req, res, next) {
  if (!req.session.user_id || req.session.is_admin === undefined || req.session.is_admin !== true) {
    SessionMetier.destroy(req.session)
      .then(function () {
        return res.redirect(req.app.get('baseurl'));
      })
      .catch(function () {
        return res.redirect(req.app.get('baseurl'));
      });
  }
  else {
    return next();
  }
});


app.set('baseurl', baseUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.use('/', index);
app.use('/profile', profile);
app.use('/admin', admin);
app.use('/admin/search', admin_search);
app.use('/api', personRessource);
app.use('/api', auth);
app.use('/api/vote', vote);
app.use('/api/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
