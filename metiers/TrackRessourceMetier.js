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
        return reject('Error retrieving id');
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
        return reject('Error retrieving id');
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
        return reject('Error retrieving id');
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
        return reject('Error recovering resource');
      }

      if (!label || label.length === 0) {
        return reject('Error recovering the label');
      }

      // We check if we don't have already an track ressource with this id ressource
      this.getByIdRessource(id_ressource)
        .then((track) => {
          if (track) {
            return reject('A track already exists with this id');
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
        return reject('Error recovering resource');
      }

      if (!email_user || email_user.length === 0) {
        return reject('Error retrieving person id');
      }

      if (!validator.isEmail(email_user)) {
        return reject('Email is not valid');
      }

      this.get(idTrack)
        .then((track) => {
          if (!track) {
            return reject('Error retrieving track');
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
                  return reject('This Chair is already added to this Track');
                }
              }

              this.trackRessourceDao.addChair(idTrack, user._id)
                .then((track) => {
                  if (!track) {
                    return reject('Error adding Chair');
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
        return reject('Error retrieving id');
      }

      if (!id_user || id_user.length === 0) {
        return reject('Error retrieving email');
      }

      this.get(idTrack)
        .then((track) => {
          if (!track) {
            return reject('Error retrieving track');
          }

          //We check if the email person is present
          if (!track.chairs || track.chairs.length === 0) {
            return reject('No chairs in the track');
          }

          const find = track.chairs.find((id) => {
            return id === id_user;
          });

          if (!find) {
            return reject('The Chair is not in this Tracj');
          }

          this.trackRessourceDao.removeChair(idTrack, id_user)
            .then((trackUpdated) => {
              if (!trackUpdated || trackUpdated.ok !== 1) {
                return reject('Error removing Chair');
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
        return reject('Error retrieving id');
      }

      if (!id_ressource || id_ressource.length === 0) {
        return reject('Error retrieving resource id');
      }

      if (!label || label.length === 0) {
        return reject('Error recovering the label');
      }

      this.get(idTrack)
        .then((track) => {
          if (!track) {
            return reject('Error retrieving track');
          }

          this.trackRessourceDao.update(idTrack, id_ressource, label)
            .then((trackUpdated) => {
              if (!trackUpdated || trackUpdated.ok !== 1) {
                return reject('Error while editing Track');
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
        return reject('Error retrieving person id');
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