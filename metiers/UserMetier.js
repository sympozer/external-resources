/**
 * Created by pierremarsot on 20/04/2017.
 */
const fs = require('fs');
const UserDao = require('../dao/UsersDao');
const validator = require('validator');
const sha1 = require('sha1');

class UserMetier {
  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Remave user avatar
   * @param id - user id
   * @returns {Promise}
   */
  removeAvatar(id) {
    return new Promise((resolve, reject) => {
      //Check user id
      if (!id) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      //Get user
      this.getById(id)
        .then((user) => {
          //If user has a avatar, we remove it
          if (user.avatar) {
            try {
              fs.unlinkSync(user.avatar);
            }
            catch (e) {
            }
          }

          //Remove avatar from dbb
          this.userDao.removeAvatar(id)
            .then((userUpdated) => {
              return resolve(userUpdated);
            })
            .catch((error) => {
              return reject(error);
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Change or set user avatar
   * @param id - user id
   * @param avatar - path avatar
   * @returns {Promise}
   */
  updateAvatar(id, avatar) {
    return new Promise((resolve, reject) => {
      //Check user id
      if (!id) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      //Check path avatar
      if (!avatar || avatar.length === 0) {
        return reject('Erreur lors de la récupération de votre avatar');
      }

      //Get user
      this.userDao.getById(id)
        .then((user) => {
          //If the user have an avatar, we delete it
          if (user.avatar) {
            try {
              fs.unlinkSync(user.avatar);
            }
            catch (e) {
            }
          }

          //Create path where the view ask
          const tab = avatar.split('/');
          if (tab.length > 0) {
            tab.splice(0, 1);
            const avatar_view = tab.join('/');

            if (avatar_view.length === 0) {
              return reject('Erreur lors de l\'extraction de l\'avatar');
            }

            //Set new informations
            user.avatar = avatar;
            user.avatar_view = avatar_view;

            //Update user
            this.userDao.updateAvatar(id, user)
              .then((userUpdated) => {
                return resolve(userUpdated);
              })
              .catch((error) => {
                return reject(error);
              });
          }
          else {
            return reject('Erreur lors de l\'extraction de l\'avatar');
          }
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Update password information
   * @param id - user id
   * @param password - new password
   * @param confirmPassword - confirm new password
   * @returns {Promise}
   */
  updatePassword(id, password, confirmPassword) {
    return new Promise((resolve, reject) => {
      //Check id
      if (!id) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      //Check password
      if (!password || password.length === 0) {
        return reject('Vous devez spécifier un mot de passe');
      }

      //Check confirm password
      if (!confirmPassword || confirmPassword.length === 0) {
        return reject('Vous devez confirmer votre mot de passe');
      }

      //Check if password and confirmPassword are the same
      if (confirmPassword !== password) {
        return reject('Vos mot de passe doivent être identiques');
      }

      //Update user password
      this.userDao.updatePassword(id, password)
        .then((userUpdated) => {
          return resolve(userUpdated);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Update user profile
   * @param id - Id user
   * @param name - New name
   * @param firstname - new firstname
   * @param twitterpage - new twitter page
   * @param facebookpage - new facebook page
   * @returns {Promise}
   */
  update(id, lastname, firstname, twitterpage, facebookpage, googleaccount, linkedinaccount, homepage) {
    return new Promise((resolve, reject) => {

      //Check if id exist
      if (!id) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      //Check is twitter page is a correct format
      if (twitterpage && twitterpage.length > 0) {
        if (!validator.isURL(twitterpage)) {
          return reject('L\'url de votre page twitter n\'est pas valide');
        }
      }

      //Check is facebook page is a correct format
      if (facebookpage && facebookpage.length > 0) {
        if (!validator.isURL(facebookpage)) {
          return reject('L\'url de votre page facebook n\'est pas valide');
        }
      }

      //Check is google page is a correct format
      if (googleaccount && googleaccount.length > 0) {
        if (!validator.isURL(googleaccount)) {
          return reject('L\'url de votre page google n\'est pas valide');
        }
      }

      //Check is linkedin page is a correct format
      if (linkedinaccount && linkedinaccount.length > 0) {
        if (!validator.isURL(linkedinaccount)) {
          return reject('L\'url de votre page linkedin n\'est pas valide');
        }
      }

      //Check is homepage is a correct format
      if (homepage && homepage.length > 0) {
        if (!validator.isURL(homepage)) {
          return reject('L\'url de votre page n\'est pas valide');
        }
      }

      //Get user
      this.getById(id)
        .then((user) => {

          if (!user) {
            return reject('Erreur lors de la récupération de votre compte');
          }

          //Set new informations
          user.lastname = lastname;
          user.firstname = firstname;
          user.facebookpage = facebookpage;
          user.twitterpage = twitterpage;
          user.googleaccount = googleaccount;
          user.linkedinaccount = linkedinaccount;
          user.homepage = homepage;

          //Update user
          this.userDao.update(id, user)
            .then((userUpdated) => {
              return resolve(userUpdated);
            })
            .catch((error) => {
              return reject(error);
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Get user by id
   * @param id - user id
   * @returns {Promise}
   */
  getById(id) {
    return new Promise((resolve, reject) => {
      //Check id
      if (!id) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      //Get user
      this.userDao.getById(id)
        .then((user) => {
          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Get user by email and password
   * @param email - user email
   * @param password - user password
   * @returns {Promise}
   */
  getByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      //Check email
      if (!email || email.length === 0) {
        return reject('Vous devez spécifier un mail');
      }

      //Check if email is a correct format
      if (!validator.isEmail(email)) {
        return reject('L\'email n\'est pas au bon format');
      }

      //Check password
      if (!password || password.length === 0) {
        return reject('Vous devez spécifier un mot de passe');
      }

      //Get user
      this.userDao.getByEmailAndPassword(email, password)
        .then((user) => {
          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Add user account
   * @param email - user email
   * @param password - user password
   * @param confirmPassword - user confirm password
   * @returns {Promise}
   */
  add(email, password, confirmPassword) {
    return new Promise((resolve, reject) => {
      //Check email
      if (!email || email.length === 0) {
        return reject('Vous devez spécifier un mail');
      }

      //Check if email is a correct format
      if (!validator.isEmail(email)) {
        return reject('Votre email doit être au bon format');
      }

      //Check password
      if (!password || password.length === 0) {
        return reject('Vous devez spécifier un mot de passe');
      }

      //Check confirm password
      if (!confirmPassword || confirmPassword.length === 0) {
        return reject('Vous devez confirmer votre mot de passe');
      }

      //Check if password and confirmPassword are the same
      if (confirmPassword !== password) {
        return reject('Vos mot de passe doivent être identiques');
      }

      //Create SHA1 from user email
      const email_sha1 = sha1(email);
      if (!email_sha1 || email_sha1.length === 0) {
        return reject('Erreur lors du cryptage de votre email');
      }

      //Create account
      this.userDao.add(email, email_sha1, password)
        .then((user) => {
          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  /**
   * Get user by SHA1 email
   * @param email_sha1 - sha1 email
   * @returns {Promise}
   */
  getByEmailSha1(email_sha1) {
    return new Promise((resolve, reject) => {
      //Check sha1 email
      if (!email_sha1 || email_sha1.length === 0) {
        return reject('Invalid email');
      }

      if (email_sha1.includes(',')) {
        email_sha1 = email_sha1.split(',');
      }
      else {
        email_sha1 = [email_sha1];
      }

      //Get user
      this.userDao.getByEmailSha1(email_sha1)
        .then((user) => {
          if (!user) {
            return reject('Erreur lors de la récupération de votre compte');
          }
          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = UserMetier;