/**
 * Created by pierremarsot on 25/04/2017.
 */
const bcrypt = require('bcrypt');

class Bcrypt {
  constructor(){
    this.saltRounds = 10;
  }

  crypt(password){
    return new Promise((resolve, reject) => {
      if(!password || password.length === 0){
        return reject();
      }

      bcrypt.hash(password, this.saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if(err){
          return reject();
        }

        return resolve(hash);
      });
    });
  }

  compare(password, hash){
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function(err, res) {
        if(err){
          return reject();
        }

        return res ? resolve() : reject();
      });
    });
  }
}

module.exports = Bcrypt;