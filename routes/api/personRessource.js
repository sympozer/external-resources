var express = require('express');
var router = express.Router();
const UserMetier = require('../../metiers/UserMetier');

/* Get person ressource by mail box sha1 or id ressource */
router.get('/ressource/person', function(req, res, next){
  const email_sha1 = req.query.email_sha1;
  const id_ressource = req.query.id_ressource;

  const userMetier = new UserMetier();
  userMetier.getByEmailSha1(email_sha1, id_ressource)
    .then(function(user){
      console.log(user);
      return res.json(user);
    })
    .catch(function(error){
      console.log(error);
      return res.json({
        error: error
      });
    });
});

module.exports = router;
