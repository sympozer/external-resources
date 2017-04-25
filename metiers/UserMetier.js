/**
 * Created by pierremarsot on 20/04/2017.
 */
const fs = require('fs');
const UserDao = require('../dao/UsersDao');
const validator = require('validator');
const sha1 = require('sha1');
const Bcrypt = require('../tools/Bcrypt');
const uuidV1 = require('uuid/v1');

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
        .then(() => {
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
        return reject('Erreur lors de la récupération de l\'url de votre photo');
      }

      if (!validator.isURL(avatar)) {
        return reject('L\'url de votre photo n\'est pas au bon format');
      }

      //Get user
      this.userDao.getById(id)
        .then((user) => {
          //Set new informations
          user.avatar = avatar;

          //Update user
          this.userDao.updateAvatar(id, user)
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

      //Hash password
      const bcrypt = new Bcrypt();
      bcrypt.crypt(password)
        .then((hash) => {
          //Update user password
          this.userDao.updatePassword(id, hash)
            .then((userUpdated) => {
              return resolve(userUpdated);
            })
            .catch((error) => {
              return reject(error);
            });
        })
        .catch(() => {
          return reject('Erreur lors de la sécurisation de votre mot de passe');
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
      this.userDao.getByEmail(email)
        .then((user) => {
          if (!user) {
            return reject('Erreur lors de la récupération de votre compte');
          }

          //Check hash password
          const bcrypt = new Bcrypt();
          bcrypt.compare(password, user.password)
            .then(() => {
              return resolve(user);
            })
            .catch(() => {
              return reject('Votre mot de passe ne correspond pas');
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  addByAdmin(id_ressource) {
    return new Promise((resolve, reject) => {
      if (!id_ressource || id_ressource.length === 0) {
        return reject('Erreur lors de la récupération de l\'id de la ressource');
      }

      this.userDao.getByIdRessource(id_ressource)
        .then((user) => {
          if (user) {
            return reject('Une ressource existe déjà avec cet id');
          }

          const email = uuidV1() + "@gmail.com";
          const password = uuidV1();

          this.add(email, password, password)
            .then((user) => {
              if (!user) {
                return reject('Erreur lors de la création de la ressource');
              }

              this.userDao.setIdRessource(user._id, id_ressource)
                .then((userUpdated) => {
                  if (!userUpdated) {
                    return reject('Le compte a bien été créé mais l\'id de la ressource n\'a pas pu être enregistré');
                  }

                  user.id_ressource = id_ressource;
                  return resolve(user);
                })
                .catch((error) => {
                  return reject(error);
                });
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

      //Check if an account have the same email(already exist)
      this.userDao.getByEmail(email)
        .then((user) => {
          if (user) {
            return reject('Un compte existe déjà avec cet email');
          }

          //Hash password
          const bcrypt = new Bcrypt();
          bcrypt.crypt(password)
            .then((hash) => {
              //Create account
              this.userDao.add(email, email_sha1, hash)
                .then((user) => {
                  return resolve(user);
                })
                .catch((error) => {
                  return reject(error);
                });
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
   * Get user by SHA1 email
   * @param email_sha1 - sha1 email
   * @returns {Promise}
   */
  getByEmailSha1(email_sha1, id_ressource) {
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
            this.userDao.getByIdRessource(id_ressource)
              .then((user) => {
                if (!user) {
                  return reject();
                }

                return resolve(user);
              })
              .catch((error) => {
                return reject(error);
              });
          }
          else {
            if (id_ressource && id_ressource.length > 0 && !user.id_ressource) {
              //Check if we have a account create by an admin with this id ressource
              this.userDao.getByIdRessource(id_ressource)
                .then((userCreatedByAdmin) => {
                  if (userCreatedByAdmin) {
                    //We have an account created by an admin, we merge informations
                    if (!user.firstname) {
                      user.firstname = userCreatedByAdmin.firstname;
                    }
                    if (!user.lastname) {
                      user.lastname = userCreatedByAdmin.lastname;
                    }
                    if (!user.avatar) {
                      user.avatar = userCreatedByAdmin.avatar;
                    }
                    if (!user.twitterpage) {
                      user.twitterpage = userCreatedByAdmin.twitterpage;
                    }
                    if (!user.facebookpage) {
                      user.facebookpage = userCreatedByAdmin.facebookpage;
                    }
                    if (!user.googleaccount) {
                      user.googleaccount = userCreatedByAdmin.googleaccount;
                    }
                    if (!user.linkedinaccount) {
                      user.linkedinaccount = userCreatedByAdmin.linkedinaccount;
                    }
                    if (!user.homepage) {
                      user.homepage = userCreatedByAdmin.homepage;
                    }

                    user.id_ressource = id_ressource;

                    //We save user
                    this.userDao.mergeInformations(user._id, user)
                      .then(() => {
                        //We remove the user account created by admin
                        this.userDao.remove(userCreatedByAdmin._id)
                          .then(() => {
                            return resolve(user);
                          })
                          .catch((error) => {
                            return reject(error);
                          });
                      })
                      .catch((error) => {
                        return reject(error);
                      });
                  }
                  else {
                    //We don't have an account create by an admin, so we set the id ressource to the user account
                    this.userDao.setIdRessource(user._id, id_ressource)
                      .then(() => {
                        user.id_ressource = id_ressource;
                        return resolve(user);
                      })
                      .catch((error) => {
                        return reject(error);
                      });
                  }
                })
                .catch((error) => {
                  return reject(error);
                });
            }
            else {
              return resolve(user);
            }
          }
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = UserMetier;