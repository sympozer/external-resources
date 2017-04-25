var express = require('express');
var router = express.Router();
const AdminsMetier = require('../metiers/AdminsMetier');
const SessionMetier = require('../metiers/SessionMetier');

router.get('/dashboard', function(req, res, next){
  return res.render('admin_dashboard');
});

router.post('/manage/profil/user', function(req, res, next){
  return next();
});

module.exports = router;
