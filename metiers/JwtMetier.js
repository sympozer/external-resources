/**
 * Created by pierremarsot on 20/04/2017.
 */
const jwtsimple = require('jwt-simple'),
  moment = require('moment'),
  config = require('../config');

class JwtMetier {
  static createToken(user){
    try
    {
      if(!user || !user.id){
        return null;
      }

      const expires = moment().add('days', 7).valueOf();
      return jwtsimple.encode({
        iss: user.id,
        exp: expires
      }, config.key_jwt);

    }
    catch(e){
      return null;
    }
  }

  static decodeToken(token){
    try {
      var decoded = jwtsimple.decode(token, config.key_jwt);
      console.log(decoded, 'decoded');
      if(!decoded || !decoded.iss){
        return null;
      }

      return decoded.iss;
    } catch (e) {
      return null;
    }
  }
}

module.exports = JwtMetier;