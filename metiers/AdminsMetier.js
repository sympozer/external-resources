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

  removeAllDocuments() {
    return new Promise((resolve, reject) => {
      this.adminsDao.removeAllDocuments()
        .then(() => {
          return resolve();
        });
    });
  }

  removeAllVote(){
    return new Promise((resolve, reject) => {
      this.adminsDao.removeAllVote()
        .then(() => {
          return resolve();
        });
    });
  }

  get(email, password) {
    return new Promise((resolve, reject) => {
      if (!email || email.length === 0) {
        return reject('Error retrieving your email');
      }

      if (!password || password.length === 0) {
        return reject('Error retrieving your password');
      }

      this.adminsDao.getByEmail(email)
        .then((admin) => {
          if (!admin) {
            return reject('No account corresponds to this email');
          }

          //Compare password
          const bcrypt = new Bcrypt();
          bcrypt.compare(password, admin.password)
            .then(() => {
              return resolve(admin);
            })
            .catch(() => {
              return reject('No account corresponds to this email');
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
        return reject('Error retrieving your email');
      }

      if (!password || password.length === 0) {
        return reject('Error retrieving your password');
      }

      //Check if an account with this email already exist
      this.adminsDao.getByEmail(email)
        .then((admin) => {
          if (admin) {
            return reject('An account already exists with this email');
          }

          //Hash password
          const bcrypt = new Bcrypt();
          bcrypt.crypt(password)
            .then((hash) => {
              if (!hash || hash.length === 0) {
                return reject('Error securing your password');
              }

              this.adminsDao.add(email, hash)
                .then((admin) => {
                  if (!admin) {
                    return reject('Error creating admin account');
                  }

                  return resolve(admin);
                })
                .catch((error) => {
                  return reject(error);
                });
            })
            .catch(() => {
              return reject('Error securing your password');
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  removeAdminAccount(email) {
    return new Promise((resolve, reject) => {
      this.adminsDao.remove(email).then(() => {
        return resolve();
      })
        .catch(() => {
          return reject();
        });
    });
  }

  setDefaultAdminAccount(email, password) {
    return new Promise((resolve, reject) => {
      this.adminsDao.getByEmail(email)
        .then((admin) => {
          if (admin) {
            return resolve();
          }

          const bcrypt = new Bcrypt();
          bcrypt.crypt(password)
            .then((hash) => {
              if (!hash) {
                return reject();
              }

              this.adminsDao.add(email, hash)
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