/**
 * Created by pierremarsot on 25/04/2017.
 */
const Bcrypt = require('../tools/Bcrypt');
const validator = require('validator');
const AdminsDao = require('../dao/AdminsDao');

class AdminsMetier {
  constructor() {
    this.adminsDao = new AdminsDao();
    this.defaultEmail = 'root@root.com';
    this.defaultPassword = 'root';
  }

  removeAllDocuments(){
    return new Promise((resolve, reject) => {
      this.adminsDao.removeAllDocuments()
        .then(() => {
          return resolve();
        });
    });
  }

  get(email, password) {
    return new Promise((resolve, reject) => {
      if (!email || email.length === 0) {
        return reject('Erreur lors de la récupération de votre email');
      }

      if (!password || password.length === 0) {
        return reject('Erreur lors de la récupération de votre mot de passe');
      }

      this.adminsDao.getByEmail(email)
        .then((admin) => {
          if (!admin) {
            return reject('Aucun compte correspond à cet email');
          }

          //Compare password
          const bcrypt = new Bcrypt();
          bcrypt.compare(password, admin.password)
            .then(() => {
              return resolve(admin);
            })
            .catch(() => {
              return reject('Erreur lors de la récupération de votre compte admin');
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  add(email, password) {
    return new Promise((resolve, reject) => {
      if (!email || email.length === 0) {
        return reject('Erreur lors de la récupération de votre email');
      }

      if (!password || password.length === 0) {
        return reject('Erreur lors de la récupération de votre mot de passe');
      }

      //Check if an account with this email already exist
      this.adminsDao.getByEmail(email)
        .then((admin) => {
          if (admin) {
            return reject('Un compte existe déjà avec cet email');
          }

          //Hash password
          const bcrypt = new Bcrypt();
          bcrypt.crypt(password)
            .then((hash) => {
              if (!hash || hash.length === 0) {
                return reject('Erreur lors de la sécurisation de votre mot de passe');
              }

              this.adminsDao.add(email, hash)
                .then((admin) => {
                  if (!admin) {
                    return reject('Erreur lors de la création du compte admin');
                  }

                  return resolve(admin);
                })
                .catch((error) => {
                  return reject(error);
                });
            })
            .catch(() => {
              return reject('Erreur lors de la sécurisation de votre mot de passe');
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  setDefaultAdminAccount() {
    return new Promise((resolve, reject) => {
      this.adminsDao.getByEmail(this.defaultEmail)
        .then((admin) => {
          if (admin) {
            return resolve();
          }

          const bcrypt = new Bcrypt();
          bcrypt.crypt(this.defaultPassword)
            .then((hash) => {
              if (!hash) {
                return reject();
              }

              this.adminsDao.add(this.defaultEmail, hash)
                .then(() => {
                  return resolve();
                })
                .catch((error) => {
                  return reject(error);
                });
            })
            .catch(() => {
              return reject();
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = AdminsMetier;