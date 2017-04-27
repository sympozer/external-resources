/**
 * Created by pierremarsot on 27/04/2017.
 */
const VotesDao = require('../dao/VotesDao');

class VotesMetier {
  constructor() {
    this.votesDao = new VotesDao();
  }

  userAlreadyVoted(id_user) {
    return new Promise((resolve, reject) => {
      if (!id_user) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      this.votesDao.userAlreadyVoted(id_user)
        .then((alreadyVoted) => {
          return resolve(alreadyVoted);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  add(id_user, id_ressource) {
    return new Promise((resolve, reject) => {
      if (!id_user) {
        return reject('Erreur lors de la récupération de votre identifiant');
      }

      if (!id_ressource) {
        return reject('Erreur lors de la récupération de la ressource');
      }

      this.userAlreadyVoted(id_user)
        .then((alreadyVoted) => {
          if (alreadyVoted) {
            return reject('Vous avez déjà voté');
          }

          this.votesDao.add(id_user, id_ressource)
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
}

module.exports = VotesMetier;