/**
 * Created by pierremarsot on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
const UserMetier = require('../../metiers/UserMetier');
const JwtMetier = require('../../metiers/JwtMetier');

router.get('/', function(req, res, next){
  const email = req.query.email;
  const password = req.query.password;

  const userMetier = new UserMetier();
  userMetier.getByEmailAndPassword(email, password)
    .then(function(user) {
      const token = JwtMetier.createToken(user._id);

      if(!token || token.length === 0){
        return res.json({
          error: 'Erreur lors de la création du token'
        });
      }

      return res.json({
        token: token,
      });
    })
    .catch(function(error) {
      return res.json({
        error: error
      });
    });
});

router.get('/social', function(req, res, next){
  const email = req.query.email;
  const id_social_network = req.query.id_social_network;

  const userMetier = new UserMetier();
  userMetier.loginBySocialNetwork(email, id_social_network)
    .then(function(user) {
      const token = JwtMetier.createToken(user._id);

      if(!token || token.length === 0){
        return res.json({
          error: 'Erreur lors de la création du token'
        });
      }

      return res.json({
        token: token,
      });
    })
    .catch(function(error) {
      return res.json({
        error: error
      });
    });
});

module.exports = router;