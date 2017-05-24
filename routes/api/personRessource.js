var express = require('express');
var router = express.Router();
const UserMetier = require('../../metiers/UserMetier');
const PersonRessourceMetier = require('../../metiers/PersonRessourceMetier');
const JwtMetier = require('../../metiers/JwtMetier');

/* Get person ressource by mail box sha1 or id ressource */
router.get('/ressource/person', function (req, res, next) {
  const email_sha1 = req.query.email_sha1;
  const id_ressource = req.query.id_ressource;

  const userMetier = new UserMetier();
  userMetier.getByEmailSha1(email_sha1, id_ressource)
    .then(function (user) {
      return res.json(user);
    })
    .catch(function (error) {
      return res.json({
        error: error
      });
    });
});

router.post('/ressource/person', function (req, res, next) {
  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  const photoUrl = req.body.photoUrl;
  const twitterpage = req.body.twitterpage;
  const linkedinaccount = req.body.linkedinaccount;
  const homepage = req.body.homepage;
  const token = req.body.token;

  console.log(token);
  const id_user = JwtMetier.decodeToken(token);
  console.log(id_user);
  if (!id_user) {
    return res.json(403, {
      error: "Erreur lors de la récupération de votre identifiant",
    });
  }

  const personRessourceMetier = new PersonRessourceMetier();
  personRessourceMetier.getByIdUser(id_user)
    .then((id_ressource) => {
      personRessourceMetier.update(id_ressource, lastname, firstname, twitterpage, '', '', linkedinaccount, homepage, photoUrl)
        .then((personRessource) => {
          return res.json(personRessource);
        })
        .catch((error) => {
          return res.json({
            error: error
          });
        });
    })
    .catch((error) => {
      return res.json({
        error: error
      });
    });
});

module.exports = router;
