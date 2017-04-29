var express = require('express');
var router = express.Router();
const PersonRessourceMetier = require('../metiers/PersonRessourceMetier');
const SessionMetier = require('../metiers/SessionMetier');

router.post('/ressource/person', function (req, res, next) {
  const id_ressource = req.body.person_id_ressource;

  const personRessourceMetier = new PersonRessourceMetier();
  personRessourceMetier.getByIdRessource(id_ressource)
    .then((personRessource) => {
      return res.render('manage_profil_user', {person_ressource: personRessource});
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + 'admin/dashboard');
    });
});

module.exports = router;
