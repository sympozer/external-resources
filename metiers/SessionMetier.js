/**
 * Created by pierremarsot on 24/04/2017.
 */

class SessionMetier {
  /**
   * Destroy current session
   * @param session - current session
   * @returns {Promise}
   */
  static destroy(session) {
    return new Promise(function(resolve, reject){
      if(!session || !session.destroy) {
        return reject();
      }

      session.destroy(function(){
        return resolve();
      });
    });
  }
}

module.exports = SessionMetier;