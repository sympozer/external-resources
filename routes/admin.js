var express = require('express');
var router = express.Router();
const AdminsMetier = require('../metiers/AdminsMetier');
const SessionMetier = require('../metiers/SessionMetier');

/* Connexion admin page. */
router.get('/', function(req, res, next) {
  return res.render('admin');
});

/* Log in => submit form into home page */
router.post('/', function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  const adminMetier = new AdminsMetier();
  adminMetier.get(email, password)
    .then(function(user) {
      req.session.user_id = user._id;
      return res.redirect("/admin");
    })
    .catch(function(error) {
      SessionMetier.destroy(req.session)
        .then(function(){
          return res.render("admin", {error: error});
        })
        .catch(function(){
          return res.redirect("/");
        });
    });
});

module.exports = router;
