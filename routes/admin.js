var express = require('express');
var router = express.Router();
const UserMetier = require('../metiers/UserMetier');
const PersonRessourceMetier = require('../metiers/PersonRessourceMetier');
const TrackRessourceMetier = require('../metiers/TrackRessourceMetier');
const SessionMetier = require('../metiers/SessionMetier');
const VotesMetier = require('../metiers/VotesMetier');

router.get('/dashboard', function (req, res, next) {
  const personRessourceMetier = new PersonRessourceMetier();
  personRessourceMetier.find()
    .then((personsRessources) => {
      const votesMetier = new VotesMetier();
    votesMetier.dashboardVoteAdmin()
      .then((tracks) => {
        return res.render('admin_dashboard', {personsRessources: personsRessources, tracks: tracks});
      })
      .catch((error) => {
        return res.render('admin_dashboard', {personsRessources: personsRessources});
      });
    })
    .catch((error) => {
      return res.render('admin_dashboard', {error: error});
    });
});

router.post('/manage/ressource/person', function (req, res, next) {
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
      return res.redirect(req.app.get('baseurl') + 'admin/dashboard');
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + "/admin/dashboard");
    });
});

router.post('/create/ressource/person', function (req, res, next) {
  const id_ressource = req.body.person_id_ressource;
  const personRessourceMetier = new PersonRessourceMetier();

  personRessourceMetier.adminCreate(id_ressource)
    .then((personRessource) => {
      return res.render('manage_profil_user', {person_ressource: personRessource});
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + "/admin/dashboard");
    });
});

router.post('/create/ressource/track', function (req, res, next) {
  const id_ressource = req.body.track_id_ressource;
  const label = req.body.label;

  const trackRessourceMetier = new TrackRessourceMetier();

  trackRessourceMetier.add(id_ressource, label)
    .then((track) => {
      return res.render('manage_track', {track: track});
    })
    .catch(() => {
      return res.redirect(req.app.get('baseurl') + "admin/dashboard");
    });
});

router.post('/ressource/track/add/chair', function (req, res, next) {
  const id_track = req.body.id_track;
  const email_chair = req.body.email_chair;

  const trackRessourceMetier = new TrackRessourceMetier();

  trackRessourceMetier.addChair(id_track, email_chair)
    .then((track) => {
      return res.render('manage_track', {track: track});
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + "admin/dashboard");
    });
});

router.get('/ressource/track/:idTrack/remove/chair/:id_user', function (req, res, next) {
  const id_track = req.params.idTrack;
  const id_user = req.params.id_user;

  const trackRessourceMetier = new TrackRessourceMetier();

  trackRessourceMetier.removeChair(id_track, id_user)
    .then((track) => {
      return res.render('manage_track', {track: track});
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + "admin/dashboard");
    });
});

router.post('/ressource/track/update', function (req, res, next) {
  const id_ressource = req.body.id_ressource;
  const label = req.body.label;
  const id_track = req.body.id_track;

  const trackRessourceMetier = new TrackRessourceMetier();

  trackRessourceMetier.update(id_track, id_ressource, label)
    .then((track) => {
      return res.render('manage_track', {track: track});
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + "admin/dashboard");
    });
});

router.post('/create/user', function (req, res, next) {
  const user_email = req.body.user_email;

  const userMetier = new UserMetier();
  userMetier.createAccountByAdmin(user_email)
    .then((personRessource) => {
      return res.render('manage_profil_user', {person_ressource: personRessource});
    })
    .catch((error) => {
      return res.redirect(req.app.get('baseurl') + "admin/dashboard");
    });
});

module.exports = router;
