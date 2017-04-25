const express = require('express');
const router = express.Router();
const UserMetier = require('../metiers/UserMetier');
const multer = require('multer');
const path = require('path');
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);

      if (!file.originalname || file.originalname.length === 0) return cb('Erreur lors de la récupération du fichier');

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    });
  }
});

const upload = multer({storage: storage});

/* Page profile */
router.get('/', function (req, res, next) {
  const idUser = req.session.user_id;

  const userMetier = new UserMetier();
  userMetier.getById(idUser)
    .then(function (user) {
      return res.render('profile', {user: user});
    })
    .catch(function (error) {
      return res.render('profile', {error: error});
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

  const userMetier = new UserMetier();
  userMetier.update(idUser, lastname, firstname, twitterpage, facebookpage, googleaccount, linkedinaccount, homepage)
    .then(function (user) {
      return res.redirect('/profile');
    })
    .catch(function (error) {
      return res.render('profile', {error: error});
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
      return res.redirect('/profile');
    })
    .catch(function (error) {
      return res.render('profile', {error: error});
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
      return res.render('avatar', {error: error});
    });
});

/* Upload user avatar */
router.post('/avatar', function (req, res, next) {
  const idUser = req.session.user_id;

  const avatar = req.body.url_photo;
console.log(avatar);
  const userMetier = new UserMetier();
  userMetier.updateAvatar(idUser, avatar)
    .then(function (userUpdated) {
      return res.redirect('/profile');
    })
    .catch(function (error) {
      console.log(error);
      return res.redirect('/profile');
    });
});

/* Remove user avatar */
router.get('/avatar/remove', function (req, res, next) {
  const idUser = req.session.user_id;

  const userMetier = new UserMetier();
  userMetier.removeAvatar(idUser)
    .then(function () {
      res.redirect('/profile');
    })
    .catch(function () {
      res.redirect('/profile');
    });
});

module.exports = router;
