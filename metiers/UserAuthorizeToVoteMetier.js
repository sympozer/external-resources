/**
 * Created by pierremarsot on 28/05/2017.
 */
const UserAuthorizeToVoteDao = require('../dao/UsersAuthorizeToVoteDao');

class UserAuthorizeToVoteMetier {
  constructor() {
    this.userAuthorizeToVoteDao = new UserAuthorizeToVoteDao();
  }

  add(email) {
    return new Promise((resolve, reject) => {
      this.get(email)
        .then((userAuthorizeToVote) => {
          if (userAuthorizeToVote) {
            return reject('User already authorize to vote');
          }

          this.userAuthorizeToVoteDao.add(email)
            .then((userAuthorizeToVote) => {
              return resolve(userAuthorizeToVote);
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

  get(email) {
    return new Promise((resolve, reject) => {
      this.userAuthorizeToVoteDao.get(email)
        .then((userAuthorizeToVote) => {
          return resolve(userAuthorizeToVote);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  removeByEmail(email) {
    return new Promise((resolve, reject) => {
      this.userAuthorizeToVoteDao.removeByEmail(email)
        .then(() => {
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = UserAuthorizeToVoteMetier;