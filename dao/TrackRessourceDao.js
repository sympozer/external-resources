/**
 * Created by pierremarsot on 04/05/2017.
 */
const TrackRessources = require('../models/TrackRessources');

class TrackRessourceDao {
  constructor() {

  }

  getByIdRessource(id_ressource) {
    return new Promise((resolve, reject) => {
      TrackRessources.findOne({id_ressource: id_ressource}, (err, trackRessource) => {
        if (err) {
          return reject('Erreur lors de la récupération de la track');
        }

        return resolve(trackRessource);
      });
    });
  }

  existByIdRessource(id_ressource) {
    return new Promise((resolve, reject) => {
      TrackRessources.findOne({id_ressource: id_ressource}, (err, trackRessource) => {
        if (err) {
          return reject('Erreur lors de la récupération de la track');
        }

        return resolve(trackRessource !== undefined);
      });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      TrackRessources.findOne({_id: id}, (err, trackRessource) => {
        if (err) {
          return reject('Erreur lors de la récupération de la track');
        }

        return resolve(trackRessource);
      });
    });
  }

  add(id_ressource, label) {
    return new Promise((resolve, reject) => {
      const trackRessource = new TrackRessources({
        id_ressource: id_ressource,
        label: label,
      });
      trackRessource.save((err) => {
        if (err) {
          return reject('Erreur lors de la création de la track');
        }

        return resolve(trackRessource);
      });
    });
  }

  addChair(idTrack, emailPerson) {
    return new Promise((resolve, reject) => {
      TrackRessources.findByIdAndUpdate(
        idTrack,
        {
          $push: {
            chairs: emailPerson
          }
        }, (err, track) => {
          if (err) {
            return reject('Erreur lors de l\'ajout du chair');
          }

          return resolve(track);
        });
    });
  }

  removeChair(idTrack, emailPerson) {
    return new Promise((resolve, reject) => {
      TrackRessources.update(
        {_id: idTrack},
        {$pull: {'chairs': emailPerson}},
        (err, track) => {
          if (err) {
            return reject('Erreur lors de la suppression du chair');
          }

          return resolve(track);
        });
    });
  }

  update(idTrack, id_ressource, label) {
    return new Promise((resolve, reject) => {
      TrackRessources.update(
        {_id: idTrack},
        {
          $set: {
            label: label,
            id_ressource: id_ressource
          }
        },
        (err, track) => {
          if (err) {
            return reject('Erreur lors de la suppression du chair');
          }

          return resolve(track);
        });
    });
  }
}

module.exports = TrackRessourceDao;