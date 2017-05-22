var express = require('express');
var router = express.Router();
const UserMetier = require('../metiers/UserMetier');
const AdminsMetier = require('../metiers/AdminsMetier');
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
      req.session.is_admin = false;
      return res.redirect(req.app.get('baseurl') + "profile");
    })
    .catch(function(error) {
      //Check if it's an admin account
      const adminsMetier = new AdminsMetier();
      adminsMetier.get(email, password)
        .then((admin) => {
          req.session.user_id = admin._id;
          req.session.is_admin = true;
          return res.redirect(req.app.get('baseurl') + "admin/dashboard");
        })
        .catch((error) => {
          SessionMetier.destroy(req.session)
            .then(function(){
              return res.render("index", {error: error});
            })
            .catch(function(){
              return res.redirect(req.app.get('baseurl'));
            });
        });
    });
});

router.get('/login/social', function(req, res, next){
  const email = req.query.email;
  const id_social_network = req.query.id_social_network;
  const type_social_network = req.query.type_social_network;

  const userMetier = new UserMetier();
  userMetier.loginBySocialNetwork(email, id_social_network, type_social_network)
    .then(function(user) {
      req.session.user_id = user._id;
      req.session.is_admin = false;
      req.session.type_social_network = type_social_network;
      return res.redirect(req.app.get('baseurl') + "profile");
    })
    .catch(function(error) {
      return res.json({
        error: error
      });
    });
});

/* Log out */
router.get('/logout', function(req, res, next) {
  SessionMetier.destroy(req.session)
    .then(function(){
      return res.redirect(req.app.get('baseurl'));
    })
    .catch(function(){
      return res.redirect(req.app.get('baseurl'));
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
      /*req.session.user_id = user._id;
      req.session.is_admin = false;
      return res.redirect(req.app.get('baseurl') + "profile");*/
      return res.redirect(req.app.get('baseurl') + "register");
    })
    .catch(function(error){
      return res.redirect(req.app.get('baseurl') + "register");
    });
});

/* Get user by mail box sha1 */
router.get('/user/sha1', function(req, res, next){
  const email_sha1 = req.query.email_sha1;
  const id_ressource = req.query.id_ressource;

  const userMetier = new UserMetier();
  userMetier.getByEmailSha1(email_sha1, id_ressource)
    .then(function(user){
      return res.json(user);
    })
    .catch(function(error){
      return res.json({
        error: error
      });
    });
});

router.get('/account/confirm/:emailsha', function(req, res, next){
  const email_sha1 = req.params.emailsha;

  const userMetier = new UserMetier();
  userMetier.confirmAccount(email_sha1)
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
