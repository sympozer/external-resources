const express = require('express');
const router = express.Router();
const UserMetier = require('../metiers/UserMetier');
const PersonRessourceMetier = require('../metiers/PersonRessourceMetier');

/* Page profile */
router.get('/', function (req, res, next) {
  const idUser = req.session.user_id;

  const userMetier = new UserMetier();
  userMetier.getPersonRessource(idUser)
    .then(function (person_ressource) {
      return res.render('profile', {person_ressource: person_ressource});
    })
    .catch(function (error) {
      console.log(error);
      return res.redirect(req.app.get('baseurl'));
    });
});

/* Submit page profile */
router.post('/', function (req, res, next) {
  const idUser = req.session.user_id;

  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  const twitterpage = req.body.twitterpage;
  const facebookpage = req.body.facebookpage;
  const googleaccount = req.body.googleaccount;
  const linkedinaccount = req.body.linkedinaccount;
  const homepage = req.body.homepage;
  const photoUrl = req.body.photoUrl;

  const userMetier = new UserMetier();
  const personRessourceMetier = new PersonRessourceMetier();

  userMetier.getById(idUser)
    .then((user) => {

      personRessourceMetier.update(
        user.id_person_ressource,
        lastname,
        firstname,
        twitterpage,
        facebookpage,
        googleaccount,
        linkedinaccount,
        homepage,
        photoUrl)
        .then(() => {
          return res.redirect(req.app.get('baseurl') + 'profile');
        })
        .catch((error) => {
          return res.redirect(req.app.get('baseurl') + "profile");
        });
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + "profile");
    });
});

/* Page change password */
router.get('/update_password', function (req, res, next) {
  return res.render('update_password');
});

/* Submit change password */
router.post('/update_password', function (req, res, next) {
  const idUser = req.session.user_id;

  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const userMetier = new UserMetier();
  userMetier.updatePassword(idUser, password, confirmPassword)
    .then(function (user) {
      return res.redirect(req.app.get('baseurl') + 'profile');
    })
    .catch(function (error) {
      return res.redirect(req.app.get('baseurl') + "profile/update_password");
    });
});

/* Page user avatar */
router.get('/avatar', function (req, res, next) {
  const idUser = req.session.user_id;

  const userMetier = new UserMetier();
  userMetier.getById(idUser)
    .then(function (user) {
      return res.render('avatar', {user: user});
    })
    .catch(function (error) {
      return res.redirect(req.app.get('baseurl') + "profile/avatar");
    });
});

module.exports = router;
