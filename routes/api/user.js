/**
 * Created by pierremarsot on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
const UserMetier = require('../../metiers/UserMetier');
const JwtMetier = require('../../metiers/JwtMetier');

router.get('/vote/information', function(req, res, next){
  const token = req.query.token;

  const id_user = JwtMetier.decodeToken(token);

  if(!id_user){
    return res.json(404, {
      error: "Erreur lors de la récupération de votre identifiant",
    });
  }

  const userMetier = new UserMetier();
  userMetier.getTrackVotedByUser(id_user)
    .then(function(trackVoted) {
      if(trackVoted){
        return res.json(200, trackVoted);
      }
      else{
        return res.json(403, {
          error: "Erreur lors de la récupération des tracks votées",
        });
      }
    })
    .catch(function(error) {
      return res.json(403, {
        error: error
      });
    });
});

router.get('', function(req, res, next){
  const token = req.query.token;

  const id_user = JwtMetier.decodeToken(token);

  if(!id_user){
    return res.json(404, {
      error: "Erreur lors de la récupération de votre identifiant",
    });
  }

  const userMetier = new UserMetier();
  userMetier.getPersonRessource(id_user)
    .then(function(personRessource) {
      if(personRessource){
        return res.json(200, personRessource);
      }
      else{
        return res.json(403, {
          error: "Erreur lors de la récupération des tracks votées",
        });
      }
    })
    .catch(function(error) {
      return res.json(403, {
        error: error
      });
    });
});


module.exports = router;