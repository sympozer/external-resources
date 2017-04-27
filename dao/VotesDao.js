/**
 * Created by pierremarsot on 27/04/2017.
 */
const Votes = require('../models/vote');

class VotesDao {
  constructor(){

  }

  userAlreadyVoted(id_user){
    return new Promise((resolve, reject) => {
      Votes.count({
        id_user: id_user
      }, (err, count) => {
        if(err){
          return reject('Erreur');
        }

        return resolve(count > 0);
      });
    });
  }

  add(id_user, id_ressource){
    return new Promise((resolve, reject) => {
      const vote = new Votes({
        id_user: id_user,
        id_ressource: id_ressource,
      });

      vote.save((err) => {
        if(err){
          return reject('Erreur lors de l\'enregistrement de votre vote');
        }

        return resolve(vote);
      });
    });
  }
}

module.exports = VotesDao;