/**
 * Created by pierremarsot on 04/05/2017.
 */
const TrackRessourceDao = require('../dao/TrackRessourceDao');
const UserDao = require('../dao/UsersDao');
const validator = require('validator');

class TrackRessourceMetier {
  constructor() {
    this.trackRessourceDao = new TrackRessourceDao();
  }

  getByIdRessource(id_ressource) {
    return new Promise((resolve, reject) => {
      if (!id_ressource || id_ressource.length === 0) {
        return reject('Erreur lors de la récupération de l\'id');
      }

      this.trackRessourceDao.getByIdRessource(id_ressource)
        .then((track) => {
          return resolve(track);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  existByIdRessource(id_ressource) {
    return new Promise((resolve, reject) => {
      if (!id_ressource || id_ressource.length === 0) {
        return reject('Erreur lors de la récupération de l\'id');
      }

      this.trackRessourceDao.existByIdRessource(id_ressource)
        .then((exist) => {
          return resolve(exist);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      if (!id || id.length === 0) {
        return reject('Erreur lors de la récupération de l\'id');
      }

      this.trackRessourceDao.get(id)
        .then((track) => {
          return resolve(track);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  add(id_ressource, label) {
    return new Promise((resolve, reject) => {
      if (!id_ressource || id_ressource.length === 0) {
        return reject('Erreur lors de la récupération de la ressource');
      }

      if (!label || label.length === 0) {
        return reject('Erreur lors de la récupération du label');
      }

      // We check if we don't have already an track ressource with this id ressource
      this.getByIdRessource(id_ressource)
        .then((track) => {
          if (track) {
            return reject('Une track existe déjà avec cet id');
          }

          this.trackRessourceDao.add(id_ressource, label)
            .then((track) => {
              return resolve(track);
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

  addChair(idTrack, email_user) {

    return new Promise((resolve, reject) => {
      if (!idTrack || idTrack.length === 0) {
        return reject('Erreur lors de la récupération de la ressource');
      }

      if (!email_user || email_user.length === 0) {
        return reject('Erreur lors de la récupération de l\'id de la personne');
      }

      if (!validator.isEmail(email_user)) {
        return reject('L\'email n\'est pas valide');
      }

      this.get(idTrack)
        .then((track) => {
          if (!track) {
            return reject('Erreur lors de la récupération de la track');
          }

          //Get user
          const userDao = new UserDao();
          userDao.getByEmail(email_user)
            .then((user) => {
              //We check if the chair is not already present into the chair array
              if (track.chairs && track.chairs.length > 0) {
                const find = track.chairs.find((id) => {
                  return id === user._id;
                });

                if (find) {
                  return reject('Le chair est déjà ajouté à cette track');
                }
              }

              this.trackRessourceDao.addChair(idTrack, user._id)
                .then((track) => {
                  if (!track) {
                    return reject('Erreur lors de l\'ajout du chair');
                  }

                  track.chairs.push(user._id);
                  return resolve(track);
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

  removeChair(idTrack, id_user) {
    return new Promise((resolve, reject) => {
      if (!idTrack || idTrack.length === 0) {
        return reject('Erreur lors de la récupération de l\'id');
      }

      if (!id_user || id_user.length === 0) {
        return reject('Erreur lors de la récupération de l\'email');
      }

      this.get(idTrack)
        .then((track) => {
          if (!track) {
            return reject('Erreur lors de la récupération de la track');
          }

          //We check if the email person is present
          if (!track.chairs || track.chairs.length === 0) {
            return reject('Aucun chairs dans la track');
          }

          const find = track.chairs.find((id) => {
            return id === id_user;
          });

          if (!find) {
            return reject('Le chair n\'est pas dans la track');
          }

          this.trackRessourceDao.removeChair(idTrack, id_user)
            .then((trackUpdated) => {
              if (!trackUpdated || trackUpdated.ok !== 1) {
                return reject('Erreur lors de la suppression du chair');
              }

              //We remove the chair
              track.chairs = track.chairs.filter((id) => {
                return id !== id_user;
              });
              return resolve(track);
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

  update(idTrack, id_ressource, label) {
    return new Promise((resolve, reject) => {
      if (!idTrack || idTrack.length === 0) {
        return reject('Erreur lors de la récupération de l\'id');
      }

      if (!id_ressource || id_ressource.length === 0) {
        return reject('Erreur lors de la récupération de l\'id ressource');
      }

      if (!label || label.length === 0) {
        return reject('Erreur lors de la récupération du label');
      }

      this.get(idTrack)
        .then((track) => {
          if (!track) {
            return reject('Erreur lors de la récupération de la track');
          }

          this.trackRessourceDao.update(idTrack, id_ressource, label)
            .then((trackUpdated) => {
              if (!trackUpdated || trackUpdated.ok !== 1) {
                return reject('Erreur lors de la modification de la track');
              }

              track.id_ressource = id_ressource;
              track.label = label;

              return resolve(track);
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

  getAllByIdUser(id_user) {
    return new Promise((resolve, reject) => {
      if (!id_user) {
        return reject('Erreur lors de la récupération de l\'id de la personne');
      }

      this.trackRessourceDao.getAllTrackByUser(id_user)
        .then((tracks_ressource) => {
          return resolve(tracks_ressource);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = TrackRessourceMetier;