var express = require('express');
var router = express.Router();
const UserMetier = require('../metiers/UserMetier');
const SessionMetier = require('../metiers/SessionMetier');

/* Home page. */
router.get('/', function(req, res, next) {
  return res.render('index');
});

/* Log in => submit form into home page */
router.post('/', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const userMetier = new UserMetier();
  userMetier.getByEmailAndPassword(email, password)
    .then(function(user) {
      req.session.user_id = user._id;
      return res.redirect("/profile");
    })
    .catch(function(error) {
      SessionMetier.destroy(req.session)
        .then(function(){
          return res.render("index", {error: error});
        })
        .catch(function(){
          return res.redirect("/");
        });
    });
});

/* Log out */
router.get('/logout', function(req, res, next) {
  SessionMetier.destroy(req.session)
    .then(function(){
      return res.redirect("/");
    })
    .catch(function(){
      return res.redirect("/");
    });
});

/* Register page */
router.get('/register', function(req, res, next){
  res.render('register');
});

/* Submit form register */
router.post('/register', function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const userMetier = new UserMetier();
  userMetier.add(email, password, confirmPassword)
    .then(function(user){
      req.session.user_id = user._id;
      return res.redirect("/profile");
    })
    .catch(function(error){
      return res.render("register", {error: error});
    });
});

/* Get user by mail box sha1 */
router.get('/user/sha1', function(req, res, next){
  const email_sha1 = req.query.email_sha1;

  const userMetier = new UserMetier();
  userMetier.getByEmailSha1(email_sha1)
    .then(function(user){
      return res.json(user);
    })
    .catch(function(error){
      return res.json({
        error: error
      });
    });
});

module.exports = router;
