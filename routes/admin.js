var express = require('express');
var router = express.Router();
const UserMetier = require('../metiers/UserMetier');
const SessionMetier = require('../metiers/SessionMetier');

router.get('/dashboard', function(req, res, next){
  return res.render('admin_dashboard');
});

router.post('/manage/profil/user', function(req, res, next){
  const idUser = req.session.user_id;

  const user_id = req.body.user_id;
  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  const twitterpage = req.body.twitterpage;
  const facebookpage = req.body.facebookpage;
  const googleaccount = req.body.googleaccount;
  const linkedinaccount = req.body.linkedinaccount;
  const homepage = req.body.homepage;

  const userMetier = new UserMetier();
  userMetier.update(user_id, lastname, firstname, twitterpage, facebookpage, googleaccount, linkedinaccount, homepage)
    .then(function (user) {
      return res.redirect('/admin/dashboard');
    })
    .catch(function (error) {
      return res.render('admin_dashboard', {error: error});
    });
});

router.get('/manage/user/:id/avatar/remove', function(req, res, next){
  const idUser = req.params.id;

  const userMetier = new UserMetier();
  userMetier.removeAvatar(idUser)
    .then(function () {
      return res.redirect('/admin/dashboard');
    })
    .catch(function (error) {
      return res.render('admin_dashboard', {error: error});
    });
});

router.post('/manage/user/avatar/change', function(req, res, next){
  const idUser = req.body.user_id;

  const avatar = req.body.url_photo;
  const userMetier = new UserMetier();
  userMetier.updateAvatar(idUser, avatar)
    .then(function (userUpdated) {
      return res.redirect('/admin/dashboard');
    })
    .catch(function (error) {
      return res.render('admin_dashboard', {error: error});
    });
});

router.post('/create/person', function(req, res, next){
  const person_id_ressource = req.body.person_id_ressource;

  const userMetier = new UserMetier();
  userMetier.addByAdmin(person_id_ressource)
    .then(function (user) {
      return res.render('manage_profil_user', {user: user});
    })
    .catch(function (error) {
      return res.render('admin_dashboard', {error: error});
    });
});

module.exports = router;
