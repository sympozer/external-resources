/**
 * Created by pierremarsot on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
const VotesMetier = require('../../metiers/VotesMetier');
const JwtMetier = require('../../metiers/JwtMetier');

router.get('/', function(req, res, next){
  const token = req.query.token;
  const id_ressource = req.query.id_ressource;

  const id_user = JwtMetier.decodeToken(token);
  if(!id_user){
    return res.json(404, {
      error: "Erreur lors de la récupération de votre identifiant",
    });
  }

  const votesMetier = new VotesMetier();
  votesMetier.add(id_user, id_ressource)
    .then(function(vote) {
      if(vote){
        return res.sendStatus(200);
      }
      else{
        return res.json(403, {
          error: "Erreur lors de l\'enregistrement de votre vote",
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