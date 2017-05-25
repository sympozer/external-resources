/**
 * Created by pierremarsot on 25/04/2017.
 */
const Admins = require('../models/admin');
const PersonRessources = require('../models/PersonRessources');
const TrackRessources = require('../models/TrackRessources');
const vote = require('../models/vote');
const users = require('../models/users');

class AdminsDao {
  constructor() {

  }

  removeAllDocuments(){
    return new Promise((resolve, reject) => {
      PersonRessources.remove({}, (err, results) => {
        TrackRessources.remove({}, () => {
          vote.remove({}, () => {
            users.remove({}, () => {
              return resolve();
            });
          });
        });
      });
    });
  }

  getByEmail(email) {
    return new Promise((resolve, reject) => {
      Admins.findOne({
        email: email
      }, (err, admin) => {
        if (err) {
          return reject('Erreur lors de la récupération de votre compte');
        }

        return resolve(admin);
      });
    });
  }

  add(email, password) {
    return new Promise((resolve, reject) => {
      const admin = new Admins({
        email: email,
        password: password,
      });

      admin.save((err) => {
        if (err) {
          return reject('Erreur lors de la création de votre compte');
        }

        return resolve(admin);
      });
    });
  }
}

module.exports = AdminsDao;