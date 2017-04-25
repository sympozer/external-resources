var express = require('express');
var router = express.Router();
const SearchPersonMetier = require('../metiers/SearchPersonMetier');
const SessionMetier = require('../metiers/SessionMetier');

router.post('/person', function (req, res, next) {
  const id_ressource = req.body.person_id_ressource;

  const searchPersonMetier = new SearchPersonMetier();
  searchPersonMetier.getByRessourceId(id_ressource)
    .then((user) => {
      return res.render('manage_profil_user', {user: user});
    })
    .catch((error) => {
      return res.redirect('/admin/dashboard');
    });
});

module.exports = router;
