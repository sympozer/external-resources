/**
 * Created by pierremarsot on 27/04/2017.
 */
var express = require('express');
var router = express.Router();
const VotesMetier = require('../../metiers/VotesMetier');
const JwtMetier = require('../../metiers/JwtMetier');

router.post('/', function(req, res, next){
  const token = req.body.token;
  const id_ressource = req.body.id_ressource;
  const id_track = req.body.id_track;

  const id_user = JwtMetier.decodeToken(token);
  if(!id_user){
    return res.json(403, {
      error: "Error retrieving your id",
    });
  }

  const votesMetier = new VotesMetier();
  votesMetier.add(id_user, id_ressource, id_track)
    .then(function(vote) {
      if(vote){
        return res.sendStatus(200);
      }
      else{
        return res.json(403, {
          error: "Error saving your vote",
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