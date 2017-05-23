/**
 * Created by pierremarsot on 23/05/2017.
 */
const sha1 = require('sha1');
class ManagerSha {
  constructor(){

  }

  encode(str){
    return sha1(str);
  }

  encodeEmail(email){
    return sha1('mailto:'+email);
  }
}

module.exports = ManagerSha;