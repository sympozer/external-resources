var express = require('express');
var router = express.Router();
const UserMetier = require('../metiers/UserMetier');
const PersonRessourceMetier = require('../metiers/PersonRessourceMetier');
const SessionMetier = require('../metiers/SessionMetier');

router.get('/dashboard', function(req, res, next){
  return res.render('admin_dashboard');
});

router.post('/manage/ressource/person', function(req, res, next){
  const id_person_ressource = req.body.id_person_ressource;
  const lastname = req.body.lastname;
  const firstname = req.body.firstname;
  const twitterpage = req.body.twitterpage;
  const facebookpage = req.body.facebookpage;
  const googleaccount = req.body.googleaccount;
  const linkedinaccount = req.body.linkedinaccount;
  const homepage = req.body.homepage;
  const photoUrl = req.body.photoUrl;

  const personRessourceMetier = new PersonRessourceMetier();
  personRessourceMetier.update(id_person_ressource, lastname, firstname, twitterpage, facebookpage, googleaccount, linkedinaccount, homepage, photoUrl)
    .then(() => {
      return res.redirect('/admin/dashboard');
    })
    .catch((error) => {
      return res.render('admin_dashboard', {error: error});
    });
});

router.post('/create/ressource/person', function(req, res, next){
  const id_ressource = req.body.person_id_ressource;
  const personRessourceMetier = new PersonRessourceMetier();

  personRessourceMetier.adminCreate(id_ressource)
    .then((personRessource) => {
      return res.render('manage_profil_user', {person_ressource: personRessource});
    })
    .catch((error) => {
      return res.render('admin_dashboard', {error: error});
    });
});

module.exports = router;
