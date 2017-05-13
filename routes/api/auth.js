/**
 * Created by pierremarsot on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
const UserMetier = require('../../metiers/UserMetier');
const JwtMetier = require('../../metiers/JwtMetier');

router.get('/login', function (req, res, next) {
  const email = req.query.email;
  const password = req.query.password;

  const userMetier = new UserMetier();
  userMetier.getByEmailAndPassword(email, password)
    .then(function (user) {
      const token = JwtMetier.createToken(user._id);

      if (!token || token.length === 0) {
        return res.json(403, {
          error: 'Erreur lors de la création du token'
        });
      }

      return res.json(403, {
        token: token,
      });
    })
    .catch(function (error) {
      return res.json(403, {
        error: error
      });
    });
});

router.get('/login/social', function (req, res, next) {
  const email = req.query.email;
  const id_social_network = req.query.id_social_network;
  const type_social_network = req.query.type_social_network;

  const userMetier = new UserMetier();
  userMetier.loginBySocialNetwork(email, id_social_network, type_social_network)
    .then(function (user) {
      const token = JwtMetier.createToken(user._id);

      if (!token || token.length === 0) {
        return res.json({
          error: 'Erreur lors de la création du token'
        });
      }

      return res.json({
        token: token,
      });
    })
    .catch(function (error) {
      return res.json({
        error: error
      });
    });
});

router.post('/register', function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const userMetier = new UserMetier();
  userMetier.add(email, password, confirmPassword)
    .then(function (user) {
      const token = JwtMetier.createToken(user._id);

      if (!token || token.length === 0) {
        return res.json(403, {
          error: 'Erreur lors de la création du token'
        });
      }

      return res.json(403, {
        token: token,
      });
    })
    .catch(function (error) {
      return res.json(403, {
        error: error
      });
    });
});

module.exports = router;