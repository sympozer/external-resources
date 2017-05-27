/**
 * Created by pierremarsot on 25/04/2017.
 */
const UsersDao = require('../dao/UsersDao');

class SearchPersonMetier {
  constructor() {
    this.usersDao = new UsersDao();
  }

  getByRessourceId(ressource_id) {
    return new Promise((resolve, reject) => {
      if (!ressource_id || ressource_id.length === 0) {
        return reject('Error retrieving resource id');
      }

      this.usersDao.getByIdRessource(ressource_id)
        .then((user) => {
          if (!user) {
            return reject('No account matches');
          }

          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

module.exports = SearchPersonMetier;