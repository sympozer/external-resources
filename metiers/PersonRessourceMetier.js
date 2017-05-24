/**
 * Created by pierremarsot on 27/04/2017.
 */
const PersonRessourceDao = require('../dao/PersonRessourceDao');
const UsersDao = require('../dao/UsersDao');
const validator = require('validator');

class PersonRessourceMetier {
  constructor() {
    this.personRessourceDao = new PersonRessourceDao();
    this.userDao = new UsersDao();
  }

  find() {
    return new Promise((resolve, reject) => {
      this.personRessourceDao.find()
        .then((personsRessources) => {
          return resolve(personsRessources);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  getByIdUser(id_user) {
    return new Promise((resolve, reject) => {
      if (!id_user || id_user.length === 0) {
        return reject('Erreur lors de la récupération de l\'identifiant de l\'user');
      }

      this.userDao.getIdRessource(id_user)
        .then((id_ressource) => {
          return resolve(id_ressource);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      if (!id || id.length === 0) {
        return reject('Erreur lors de la récupération de l\'identifiant de la ressource');
      }

      this.personRessourceDao.get(id)
        .then((personRessource) => {
          if (!personRessource) {
            return reject('Erreur lors de la récupération de la ressource');
          }

          return resolve(personRessource);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  getByIdRessource(id) {
    return new Promise((resolve, reject) => {
      if (!id || id.length === 0) {
        return reject('Erreur lors de la récupération de l\'identifiant de la ressource');
      }

      this.personRessourceDao.getByIdRessource(id)
        .then((personRessource) => {
          return resolve(personRessource);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  update(id, lastname, firstname, twitterpage, facebookpage, googleaccount, linkedinaccount, homepage, photoUrl) {
    return new Promise((resolve, reject) => {

      //Check if id exist
      if (!id) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      /*//Check is twitter page is a correct format
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
       }*/

      //Check is homepage is a correct format
      if (homepage && homepage.length > 0) {
        if (!validator.isURL(homepage)) {
          return reject('Your homepage is not valid');
        }
      }

      //Check is photo url is a correct format
      if (photoUrl && photoUrl.length > 0) {
        if (!validator.isURL(photoUrl)) {
          return reject('Your photo url is not valid');
        }
      }

      //Get user
      this.get(id)
        .then((personRessource) => {
          if (!personRessource) {
            return reject('Cannot get person resource');
          }

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
          this.personRessourceDao.update(personRessource)
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
    });
  }

  createByDefault() {
    return new Promise((resolve, reject) => {
      this.personRessourceDao.createByDefault()
        .then((personRessource) => {
          if (!personRessource) {
            return reject('Erreur lors de la création de la ressource');
          }

          return resolve(personRessource);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  adminCreate(id_ressource) {
    return new Promise((resolve, reject) => {
      if (!id_ressource || id_ressource.length === 0) {
        return reject('Erreur lors de la récupération de l\'identifiant de la ressource');
      }

      this.getByIdRessource(id_ressource)
        .then((personRessource) => {
          if (personRessource) {
            return reject('Une person ressource existe déjà avec cet identifiant');
          }

          //Check if a person ressource exist with this id
          this.personRessourceDao.adminCreate(id_ressource)
            .then((personRessource) => {
              if (!personRessource) {
                return reject('Erreur lors de la création de la ressource');
              }

              return resolve(personRessource);
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

  mergeInformations(personRessource) {
    return new Promise((resolve, reject) => {
      this.personRessourceDao.mergeInformations(personRessource)
        .then(() => {
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  remove(id) {
    return new Promise((resolve, reject) => {
      this.personRessourceDao.remove(id)
        .then(() => {
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  setIdRessource(id, id_ressource) {
    return new Promise((resolve, reject) => {
      this.personRessourceDao.setIdRessource(id, id_ressource)
        .then(() => {
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = PersonRessourceMetier;