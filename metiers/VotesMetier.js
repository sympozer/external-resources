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

      if (!id_track) {
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

      if (!id_track) {
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

  getTrackVotedByUser(id_user) {
    return new Promise((resolve, reject) => {
      this.votesDao.getTrackVotedByUser(id_user)
        .then((votes) => {
          if (!votes || votes.length === 0) {
            return resolve([]);
          }

          const trackVoted = [];
          for (const vote of votes) {
            if (vote.id_track) {
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

  getStatisticTrackVoted(ids_tracks) {
    return new Promise((resolve, reject) => {
      //Get all track voted
      const promises = [];

      for (const id_track of ids_tracks) {
        promises.push(this.votesDao.getSumTrackVoted(id_track));
      }

      Promise.all(promises)
        .then((tracksInformationVoted) => {

          const tabTracks = [];
          for (const inf of tracksInformationVoted) {
            const find = tabTracks.find((t) => {
              return t.id_track === inf;
            });
          }

          return resolve(tracksInformationVoted);
        })
        .catch(() => {
          return reject('Erreur lors de la récupération des tracks');
        });
    });
  }

  dashboardVoteAdmin() {
    return new Promise((resolve, reject) => {
      //Get all documents vote
      this.votesDao.getAll()
        .then((votes) => {

          let tracks = [];

          for (const vote of votes) {
            //Check if we have the Track
            const track = tracks.find((t) => {
              return t.id_track === vote.id_track;
            });

            //If we don't have the Track, we add it and the ressource
            if(!track){
              tracks.push({
                id_track: vote.id_track,
                ressources: [{
                  id_ressource: vote.id_ressource,
                  nb_vote: 1
                }],
              });
            }
            else{
              //Check if we have the ressource
              const ressource = track.ressources.find((r) => {
                return r.id_ressource === vote.id_ressource;
              });

              //If the Track doesn't have the ressource, we add it
              if(!ressource){
                track.ressources.push({
                  id_ressource: vote.id_ressource,
                  nb_vote: 1
                });
              }
              //Else, we increment the count
              else{
                ressource.nb_vote++;
              }
            }
          }

          return resolve(tracks);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = VotesMetier;