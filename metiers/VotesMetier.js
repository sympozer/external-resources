/**
 * Created by pierremarsot on 27/04/2017.
 */
const VotesDao = require('../dao/VotesDao');

class VotesMetier {
  constructor() {
    this.votesDao = new VotesDao();
  }

  userAlreadyVoted(id_user, id_track) {
    return new Promise((resolve, reject) => {
      if (!id_user) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      if(!id_track){
        return reject('Erreur lors de la récupération de la track');
      }

      this.votesDao.userAlreadyVoted(id_user, id_track)
        .then((alreadyVoted) => {
          return resolve(alreadyVoted);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  add(id_user, id_ressource, id_track) {
    return new Promise((resolve, reject) => {
      if (!id_user) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      if (!id_ressource) {
        return reject('Erreur lors de la récupération de la ressource');
      }

      if(!id_track){
        return reject('Erreur lors de la récupération de la track');
      }

      this.userAlreadyVoted(id_user, id_track)
        .then((alreadyVoted) => {
          if (alreadyVoted) {
            return reject('Vous avez déjà voté');
          }

          this.votesDao.add(id_user, id_ressource, id_track)
            .then((vote) => {
              return resolve(vote);
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

  getTrackVoted(id_user) {
    return new Promise((resolve, reject) => {
      this.votesDao.getTrackVoted(id_user)
        .then((votes) => {
          if(!votes || votes.length === 0){
            return resolve([]);
          }

          const trackVoted = [];
          for(const vote of votes){
            if(vote.id_track) {
              trackVoted.push(vote.id_track);
            }
          }

          return resolve(trackVoted);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = VotesMetier;