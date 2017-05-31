/**
 * Created by pierremarsot on 27/04/2017.
 */
const Votes = require('../models/vote');

class VotesDao {
  constructor() {

  }

  removeAllByIdUser(id_user){
    return new Promise((resolve, reject) => {
      Votes.remove({id_user: id_user}, function (error, votes) {
        if (error) {
          return reject('Error while deleting account');
        }

        if (!votes) {
          return reject();
        }

        return resolve();
      });
    });
  }

  userAlreadyVoted(id_user, id_track) {
    return new Promise((resolve, reject) => {
      Votes.count({
        id_user: id_user,
        id_track: id_track
      }, (err, count) => {
        if (err) {
          return reject('Erreur');
        }

        return resolve(count > 0);
      });
    });
  }

  add(id_user, id_ressource, id_track) {
    return new Promise((resolve, reject) => {
      const vote = new Votes({
        id_user: id_user,
        id_ressource: id_ressource,
        id_track: id_track,
      });

      vote.save((err) => {
        if (err) {
          return reject('Error saving your vote');
        }

        return resolve(vote);
      });
    });
  }

  getTrackVotedByUser(id_user) {
    return new Promise((resolve, reject) => {
      Votes.find({
        id_user: id_user
      }, (err, votes) => {
        if (err) {
          return reject('Error recovering tracks already voted')
        }

        return resolve(votes);
      });
    });
  }

  getTracksVoted() {
    return new Promise((resolve, reject) => {
      Votes.find().distinct('id_track', function (error, ids) {
        if (error) {
          return reject('Error retrieving tracks');
        }

        return resolve(ids);
      });
    });
  }

  getSumTrackVoted(id_track) {
    return new Promise((resolve, reject) => {
      Votes.count({id_track: id_track}
        , (error, count) => {
          if (!count) {
            return resolve({
              id_track: id_track,
              count: 0,
            });
          }

          return resolve({
            id_track: id_track,
            count: count,
          });
        });
    });
  }

  getAll(){
    return new Promise((resolve, reject) => {
      Votes.find({}, (error, votes) => {
        if(error){
          return reject('Error when get votes document');
        }

        return resolve(votes);
      });
    });
  }
}

module.exports = VotesDao;