/**
 * Created by pierremarsot on 25/04/2017.
 */
const Admins = require('../models/admin');

class AdminsDao {
  constructor() {

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