/**
 * Created by pierremarsot on 28/05/2017.
 */
const UserAuthorizeToVote = require('../models/UserAuthorizeToVote');

class UsersAuthorizeToVoteDao {
  constructor(){

  }

  add(email){
    return new Promise((resolve, reject) => {
      const userAuthorizeToVote = new UserAuthorizeToVote({
        email: email,
      });

      userAuthorizeToVote.save((err) => {
        if (err) {
          return reject('Error adding user');
        }

        return resolve(userAuthorizeToVote);
      });
    });
  }

  get(email){
    return new Promise((resolve, reject) => {
      UserAuthorizeToVote.findOne({
        email: email,
        //activated: true,
      }, (err, user) => {
        if (err) {
          return reject('Error retrieving');
        }

        return resolve(user);
      });
    });
  }

  removeByEmail(email){
    return new Promise((resolve, reject) => {
      UserAuthorizeToVote.findOne({email: email}, function (error, userAuthorizeToVote){
        if(error){
          return reject('Error while deleting');
        }

        if(!userAuthorizeToVote){
          return reject('Error while deleting');
        }

        userAuthorizeToVote.remove();
        return resolve();
      });
    });
  }
}

module.exports = UsersAuthorizeToVoteDao;