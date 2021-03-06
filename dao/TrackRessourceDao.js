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
          return reject('Error retrieving Track');
        }

        return resolve(trackRessource);
      });
    });
  }

  existByIdRessource(id_ressource) {
    return new Promise((resolve, reject) => {
      TrackRessources.findOne({id_ressource: id_ressource}, (err, trackRessource) => {
        if (err) {
          return reject('Error retrieving Track');
        }

        return resolve(trackRessource !== undefined);
      });
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      TrackRessources.findOne({_id: id}, (err, trackRessource) => {
        if (err) {
          return reject('Error retrieving Track');
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
          return reject('Error creating Track');
        }

        return resolve(trackRessource);
      });
    });
  }

  addChair(idTrack, id_user) {
    return new Promise((resolve, reject) => {
      TrackRessources.findByIdAndUpdate(
        idTrack,
        {
          $push: {
            chairs: id_user
          }
        }, (err, track) => {
          if (err) {
            return reject('Error adding Chair');
          }

          return resolve(track);
        });
    });
  }

  removeChair(idTrack, id_user) {
    return new Promise((resolve, reject) => {
      TrackRessources.update(
        {_id: idTrack},
        {$pull: {'chairs': id_user}},
        (err, track) => {
          if (err) {
            return reject('Error deleting Chair');
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
            return reject('Error deleting Chair');
          }

          return resolve(track);
        });
    });
  }

  getAllTrackByUser(id_user){
    return new Promise((resolve, reject) => {
      TrackRessources.find({
        chairs: {
          "$in": [id_user]
        }
      }, (error, tracksRessource) => {
        if(error){
          return reject('Error recovering allowed Tracks');
        }

        return resolve(tracksRessource);
      });
    });
  }
}

module.exports = TrackRessourceDao;