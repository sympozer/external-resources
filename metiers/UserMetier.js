/**
 * Created by pierremarsot on 20/04/2017.
 */
const fs = require('fs');
const UserDao = require('../dao/UsersDao');
const validator = require('validator');
const ManagerSha = require('../tools/ManagerSha');
const Bcrypt = require('../tools/Bcrypt');
const uuidV1 = require('uuid/v1');
const PersonRessourceMetier = require('../metiers/PersonRessourceMetier');
const VotesMetier = require('../metiers/VotesMetier');
const TrackRessourceMetier = require('../metiers/TrackRessourceMetier');
const EmailSender = require('../tools/EmailSender');

class UserMetier {
  constructor() {
    this.userDao = new UserDao();
    this.personRessourceMetier = new PersonRessourceMetier();
    this.votesMetier = new VotesMetier();
  }

  find() {
    return new Promise((resolve, reject) => {
      this.userDao.find()
        .then((users) => {
          return resolve(users);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  removeById(id) {
    return new Promise((resolve, reject) => {
      this.userDao.remove(id)
        .then(() => {
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  removeByEmail(email) {
    return new Promise((resolve, reject) => {
      this.userDao.removeByEmail(email)
        .then(() => {
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  confirmAccount(email_sha1) {
    return new Promise((resolve, reject) => {
      this.userDao.getByEmailSha1(email_sha1)
        .then((user) => {
          if (!user) {
            return reject('Error retrieving your account');
          }

          this.userDao.activeAccount(user.id)
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
    });
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
        return reject('Error retrieving your login');
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
        return reject('Error retrieving your login');
      }

      //Check path avatar
      if (!avatar || avatar.length === 0) {
        return reject('Error retrieving the url of your photo');
      }

      if (!validator.isURL(avatar)) {
        return reject('Photo url is not correct');
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
        return reject('Error retrieving your login');
      }

      //Check password
      if (!password || password.length === 0) {
        return reject('You must specify a password');
      }

      //Check confirm password
      if (!confirmPassword || confirmPassword.length === 0) {
        return reject('You must confirm your password');
      }

      //Check if password and confirmPassword are the same
      if (confirmPassword !== password) {
        return reject('Your password must be the same');
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
          return reject('Error securing your password');
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
  update(id, lastname, firstname, twitterpage, facebookpage, googleaccount, linkedinaccount, homepage, photoUrl) {
    return new Promise((resolve, reject) => {

      //Check if id exist
      if (!id) {
        return reject('Error retrieving your login');
      }

      //Check is twitter page is a correct format
      if (twitterpage && twitterpage.length > 0) {
        if (!validator.isURL(twitterpage)) {
          return reject('The url of your Twitter page is not valid');
        }
      }

      //Check is facebook page is a correct format
      if (facebookpage && facebookpage.length > 0) {
        if (!validator.isURL(facebookpage)) {
          return reject('The url of your Facebook page is not valid');
        }
      }

      //Check is google page is a correct format
      if (googleaccount && googleaccount.length > 0) {
        if (!validator.isURL(googleaccount)) {
          return reject('The url of your Google page is not valid');
        }
      }

      //Check is linkedin page is a correct format
      if (linkedinaccount && linkedinaccount.length > 0) {
        if (!validator.isURL(linkedinaccount)) {
          return reject('The url of your Linkedin page is not valid');
        }
      }

      //Check is homepage is a correct format
      if (homepage && homepage.length > 0) {
        if (!validator.isURL(homepage)) {
          return reject('The url of your Homepage is not valid');
        }
      }

      //Check is photo url is a correct format
      if (photoUrl && photoUrl.length > 0) {
        if (!validator.isURL(photoUrl)) {
          return reject('The url of your photo is not valid');
        }
      }

      //Get user
      this.getById(id)
        .then((user) => {

          if (!user) {
            return reject('Error retrieving your account');
          }

          this.personRessourceMetier.get(user.id_person_ressource)
            .then((personRessource) => {
              //Set new informations
              personRessource.lastname = lastname;
              personRessource.firstname = firstname;
              personRessource.facebookpage = facebookpage;
              personRessource.twitterpage = twitterpage;
              personRessource.googleaccount = googleaccount;
              personRessource.linkedinaccount = linkedinaccount;
              personRessource.homepage = homepage;
              personRessource.photoUrl = photoUrl;

              //Update personRessource
              this.personRessourceMetier.update(personRessource)
                .then(() => {
                  return resolve(personRessource);
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
   * Get user by id
   * @param id - user id
   * @returns {Promise}
   */
  getById(id) {
    return new Promise((resolve, reject) => {
      //Check id
      if (!id) {
        return reject('Error retrieving your login');
      }

      //Get user
      this.userDao.getById(id)
        .then((user) => {
          if (!user) {
            return reject('Error retrieving your account');
          }
          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  getPersonRessource(id_user) {
    return new Promise((resolve, reject) => {
      //Get user profile information
      this.getById(id_user)
        .then((user) => {
          this.personRessourceMetier.get(user.id_person_ressource)
            .then((person_ressource) => {
              if (person_ressource) {
                person_ressource.email_sha1 = user.email_sha1;
                //Get track acces of user
                const trackRessourceMetier = new TrackRessourceMetier();
                trackRessourceMetier.getAllByIdUser(user._id)
                  .then((tracks_ressources) => {
                    if (!tracks_ressources || tracks_ressources.length === 0) {
                      return resolve(person_ressource);
                    }

                    //Get id from tracks_ressources
                    const ids_tracks = [];
                    for (const track_ressource of tracks_ressources) {
                      ids_tracks.push(track_ressource.id_ressource);
                    }

                    this.votesMetier.getStatisticTrackVoted(ids_tracks)
                      .then((tracksInformationVoted) => {
                        console.log(tracksInformationVoted);
                        person_ressource.tracks_information_voted = tracksInformationVoted;
                        return resolve(person_ressource);
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
                return reject('Error retrieving your profile');
              }
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
   * Get user by email and password
   * @param email - user email
   * @param password - user password
   * @returns {Promise}
   */
  getByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      //Check email
      if (!email || email.length === 0) {
        return reject('You must specify an email');
      }

      //Check if email is a correct format
      if (!validator.isEmail(email)) {
        return reject('Your email is not correct');
      }

      //Check password
      if (!password || password.length === 0) {
        return reject('You must specify a password');
      }

      //Get user
      this.userDao.getByEmail(email)
        .then((user) => {
          if (!user || !user.activated) {
            return reject('Error retrieving your account');
          }

          //Check hash password
          const bcrypt = new Bcrypt();
          bcrypt.compare(password, user.password)
            .then(() => {
              return resolve(user);
            })
            .catch(() => {
              return reject('Your password does not match');
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  createAccountByAdmin(email) {
    return new Promise((resolve, reject) => {
      if (!email || email.length === 0) {
        return reject('Error retrieving the id of the resource');
      }

      this.userDao.getByEmailEvenIfNotActivated(email)
        .then((user) => {
          if (user) {
            return reject('A resource already exists with this id');
          }

          const password = "000000";

          this.add(email, password, password, false)
            .then((user) => {
              if (!user) {
                return reject('Error Creating Resource');
              }

              //Activate account
              this.userDao.activeAccount(user._id)
                .then(() => {
                  this.userDao.setIdRessource(user._id, id_ressource)
                    .then((userUpdated) => {
                      if (!userUpdated) {
                        return reject('The account was successfully created but the resource id could not be saved');
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
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  addByAdmin(id_ressource) {
    return new Promise((resolve, reject) => {
      if (!id_ressource || id_ressource.length === 0) {
        return reject('Error retrieving the id of the resource');
      }

      this.userDao.getByIdRessource(id_ressource)
        .then((user) => {
          if (user) {
            return reject('A resource already exists with this id');
          }

          const email = uuidV1() + "@gmail.com";
          const password = uuidV1();

          this.add(email, password, password)
            .then((user) => {
              if (!user) {
                return reject('Error Creating Resource');
              }

              this.userDao.setIdRessource(user._id, id_ressource)
                .then((userUpdated) => {
                  if (!userUpdated) {
                    return reject('The account was successfully created but the resource id could not be saved');
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
  add(email, password, confirmPassword, sendEmail) {
    return new Promise((resolve, reject) => {
      //Check email
      if (!email || email.length === 0) {
        return reject('You must specify an email');
      }

      //Check if email is a correct format
      if (!validator.isEmail(email)) {
        return reject('Your email must be in the correct forma');
      }

      //Check password
      if (!password || password.length === 0) {
        return reject('You must specify a password');
      }

      //Check confirm password
      if (!confirmPassword || confirmPassword.length === 0) {
        return reject('You must confirm your password');
      }

      //Check if password and confirmPassword are the same
      if (confirmPassword !== password) {
        return reject('Your password must be the same');
      }

      //Create SHA1 from user email
      const managerSha = new ManagerSha();
      const email_sha1 = managerSha.encodeEmail(email);
      if (!email_sha1 || email_sha1.length === 0) {
        return reject('Error encrypting your email');
      }

      //Check if an account have the same email(already exist)
      this.userDao.getByEmail(email)
        .then((user) => {
          if (user) {
            return reject('An account already exists with this email');
          }

          //Create person ressource
          this.personRessourceMetier.createByDefault()
            .then((personRessource) => {
              //Hash password
              const bcrypt = new Bcrypt();
              bcrypt.crypt(password)
                .then((hash) => {
                  //Create account
                  this.userDao.add(email, email_sha1, hash, personRessource._id)
                    .then((user) => {
                      if (sendEmail === undefined || sendEmail === true) {
                        //Send an email
                        const emailSender = new EmailSender();
                        const html = "<p>Hello,</p><p>You are receiving this email since someone (probably you) has requested to create an account with the email address " + email + " on the ESWC2017 application.</p><p>If you agree with this, please <a href='https://sympozer.com/external/account/confirm/" + email_sha1 + "'>click here</a>. Otherwise, just ignore this email.</p><p>Best regards,</p><p>The Sympozer (ESWC2017) app team.</p>";

                        emailSender.send(email, 'Email confirmation for ESWC2017 app', null, html)
                          .then((info) => {
                            return resolve(user);
                          })
                          .catch(() => {
                            return resolve("Your account seems to be created but we can't sent you an email to confirm it");
                          });
                      }
                      else {
                        return resolve(user);
                      }
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
          //If we don't have user by sha1, we search a person ressource by id
          if (!user) {
            this.personRessourceMetier.getByIdRessource(id_ressource)
              .then((personRessource) => {
                if (!personRessource) {
                  return reject();
                }

                return resolve(personRessource);
              })
              .catch((error) => {
                return reject(error);
              });
          }
          else {
            //We get the person ressource about user
            this.personRessourceMetier.get(user.id_person_ressource)
              .then((personRessource) => {
                //We try to merge
                if (id_ressource && id_ressource.length > 0 && (!personRessource.id_ressource || personRessource.id_ressource !== id_ressource)) {
                  //Check if we have a person ressource created by an admin with this id ressource
                  this.personRessourceMetier.getByIdRessource(id_ressource)
                    .then((personRessourceCreatedByAdmin) => {
                      if (personRessourceCreatedByAdmin) {
                        //We have an person ressource created by an admin, we merge informations
                        if (!personRessource.firstname) {
                          personRessource.firstname = personRessourceCreatedByAdmin.firstname;
                        }
                        if (!personRessource.lastname) {
                          personRessource.lastname = personRessourceCreatedByAdmin.lastname;
                        }
                        if (!personRessource.photoUrl) {
                          personRessource.photoUrl = personRessourceCreatedByAdmin.photoUrl;
                        }
                        if (!personRessource.twitterpage) {
                          personRessource.twitterpage = personRessourceCreatedByAdmin.twitterpage;
                        }
                        if (!personRessource.facebookpage) {
                          personRessource.facebookpage = personRessourceCreatedByAdmin.facebookpage;
                        }
                        if (!personRessource.googleaccount) {
                          personRessource.googleaccount = personRessourceCreatedByAdmin.googleaccount;
                        }
                        if (!personRessource.linkedinaccount) {
                          personRessource.linkedinaccount = personRessourceCreatedByAdmin.linkedinaccount;
                        }
                        if (!personRessource.homepage) {
                          personRessource.homepage = personRessourceCreatedByAdmin.homepage;
                        }
                        if (!personRessource.id_ressource) {
                          personRessource.id_ressource = personRessourceCreatedByAdmin.id_ressource;
                        }

                        //We save user
                        this.personRessourceMetier.mergeInformations(personRessource)
                          .then(() => {
                            //We remove the user account created by admin
                            this.personRessourceMetier.remove(personRessourceCreatedByAdmin._id)
                              .then(() => {
                                return resolve(personRessource);
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
                        this.personRessourceMetier.setIdRessource(personRessource._id, id_ressource)
                          .then(() => {
                            personRessource.id_ressource = id_ressource;
                            return resolve(personRessource);
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
                else if (personRessource) {
                  this.personRessourceMetier.setIdRessource(personRessource._id, id_ressource)
                    .then(() => {
                      personRessource.id_ressource = id_ressource;
                      return resolve(personRessource);
                    })
                    .catch((error) => {
                      return reject(error);
                    });
                }
                else {
                  return reject();
                }
              })
              .catch((error) => {
                return reject(error);
              });
          }
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  getByEmail(email_user) {
    return new Promise((resolve, reject) => {
      if (!email_user) {
        return reject('Erreur lors de la récupération de l\'email');
      }

      if (!validator.isEmail(email_user)) {
        return reject('L\'email n\'est pas valide');
      }

      this.userDao.getByEmail(email_user)
        .then((user) => {
          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  loginBySocialNetwork(email, id_social_network, type_social_network) {
    return new Promise((resolve, reject) => {
      if (!email || email.length === 0) {
        return reject('Error retrieving your email');
      }

      if (!id_social_network || id_social_network.length === 0) {
        return reject('Error retrieving your login');
      }

      if (!validator.isEmail(email)) {
        return reject('Your email is not correct');
      }

      if (!type_social_network || type_social_network.length === 0) {
        return reject('You must specify a type of social network');
      }

      //We try to get user account
      this.userDao.getByEmailAndIdSocialNetwork(email, id_social_network, type_social_network)
        .then((user) => {
          //If we don't have an account, we create it
          if (!user) {
            //Create person ressource
            this.personRessourceMetier.createByDefault()
              .then((personRessource) => {
                console.log(personRessource);
                //Create user account
                this.createAccountBySocialNetwork(email, id_social_network, type_social_network, personRessource._id)
                  .then((user) => {
                    if (!user) {
                      return reject('Error retrieving your account');
                    }

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
            //Else we return the user
            return resolve(user);
          }
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  createAccountBySocialNetwork(email, id_social_network, type_social_network, id_person_ressource) {
    return new Promise((resolve, reject) => {
      if (!email || email.length === 0) {
        return reject('Error retrieving your email');
      }

      if (!id_social_network || id_social_network.length === 0) {
        return reject('Error retrieving your login');
      }

      if (!id_person_ressource || id_person_ressource.length === 0) {
        return reject('Error recovering your resource');
      }

      if (!validator.isEmail(email)) {
        return reject('Your email is not correct');
      }

      //Create SHA1 from user email
      const managerSha = new ManagerSha();
      const email_sha1 = managerSha.encodeEmail(email);
      if (!email_sha1 || email_sha1.length === 0) {
        return reject('Error encrypting your email');
      }

      if (!type_social_network || type_social_network.length === 0) {
        return reject('You must specify a type of social network');
      }

      //Check if an account don't exist with this email
      this.userDao.getByEmail(email)
        .then((user) => {
          if (user) {
            return reject('An account already exists with this email');
          }

          //Create user account
          this.userDao.addBySocialNetwork(email, email_sha1, id_social_network, type_social_network, id_person_ressource)
            .then((user) => {
              if (!user) {
                return reject('Error creating your account');
              }

              return resolve(user);
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

  getTrackVotedByUser(id_user) {
    return new Promise((resolve, reject) => {
      if (!id_user || id_user.length === 0) {
        return reject('Error retrieving your login');
      }

      this.votesMetier.getTrackVotedByUser(id_user)
        .then((trackVoted) => {
          return resolve(trackVoted);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = UserMetier;