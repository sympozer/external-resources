/**
 * Created by pierremarsot on 20/04/2017.
 */

/**
 * Model Schema
 */
const Users = require('../models/users');

class UsersDao {
  constructor() {

  }

  find(){
    return new Promise((resolve, reject) => {
      Users.find({}, (err, users) => {
        if (err) {
          return reject('Error retrieving users');
        }

        return resolve(users);
      });
    });
  }

  /**
   * Remove user avatar
   * @param id - user id
   * @returns {Promise}
   */
  removeAvatar(id) {
    return new Promise((resolve, reject) => {
      Users.update({_id: id}, {$unset: {avatar: 1}}, (err, userUpdated) => {
        if (err) {
          return reject('Error while deleting your photo');
        }

        return resolve(userUpdated);
      });
    });
  }

  /**
   * Change or set user avatar
   * @param id - user id
   * @param user - user with new informations
   * @returns {Promise}
   */
  updateAvatar(id, user) {
    return new Promise((resolve, reject) => {

      Users.update({_id: id}, {
        $set: {
          avatar: user.avatar,
        }
      }, (err, userUpdated) => {
        if (err) {
          return reject('Error while updating your photo');
        }

        return resolve(userUpdated);
      });
    });
  }

  /**
   * Change password
   * @param id - user id
   * @param password - new password
   * @returns {Promise}
   */
  updatePassword(id, password) {
    return new Promise((resolve, reject) => {

      Users.update({_id: id}, {
        $set: {
          password: password,
        }
      }, (err, userUpdated) => {
        if (err) {
          return reject('Error while changing your password');
        }

        return resolve(userUpdated);
      });
    });
  }

  /**
   * Update user profile informations
   * @param id - user id
   * @param user - user with new informations
   * @returns {Promise}
   */
  update(id, user) {
    return new Promise((resolve, reject) => {

      Users.update({_id: id}, {
        $set: {
          lastname: user.lastname,
          firstname: user.firstname,
          twitterpage: user.twitterpage,
          facebookpage: user.facebookpage,
          googleaccount: user.googleaccount,
          linkedinaccount: user.linkedinaccount,
          homepage: user.homepage,
        }
      }, (err, userUpdated) => {
        if (err) {
          return reject('Error while editing your information');
        }

        return resolve(userUpdated);
      });
    });
  }

  /**
   * Get user by id
   * @param id - user id
   * @returns {Promise}
   */
  getById(id) {
    return new Promise((resolve, reject) => {
      Users.findOne({_id: id}, (err, user) => {
        if (err || !user) {
          return reject('Error retrieving your account');
        }

        return resolve(user);
      });
    });
  }

  /**
   * Get user by email and password
   * @param email - user email
   * @param password - user password
   * @returns {Promise}
   */
  getByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        email: email,
        password: password
      }, (err, user) => {

        if (err || !user) {
          return reject('Error retrieving your account');
        }

        return resolve(user);
      });
    });
  }

  /**
   * Create user account
   * @param email - user email
   * @param email_sha1 - user sha1 email
   * @param password - user password
   * @returns {Promise}
   */
  add(email, email_sha1, password, id_person_ressource) {
    return new Promise((resolve, reject) => {
      this.getByEmail(email)
        .then((user) => {
          if (user) {
            return reject('An account already exists with this email');
          }

          user = new Users({
            email: email,
            email_sha1: email_sha1,
            password: password,
            id_person_ressource: id_person_ressource,
            activated: false,
          });

          user.save((err) => {
            if (err) {
              return reject('Error creating your account');
            }

            return resolve(user);
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  /**
   * Get user by email
   * @param email - user email
   * @returns {Promise}
   */
  getByEmail(email) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        email: email,
        activated: true,
      }, (err, user) => {
        if (err) {
          return reject('Error retrieving your account');
        }

        return resolve(user);
      });
    });
  }

  getByEmailEvenIfNotActivated(email) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        email: email,
      }, (err, user) => {
        if (err) {
          return reject('Error retrieving your account');
        }

        return resolve(user);
      });
    });
  }

  activeAccount(id){
    return new Promise((resolve, reject) => {
      Users.update({_id: id}, {
        $set: {
          activated: true,
        }
      }, (err, userUpdated) => {
        if (err) {
          return reject('Error while activating your account');
        }

        return resolve(userUpdated);
      });
    });
  }

  /**
   * Get user by sha1 email
   * @param email_sha1 - sha1 email
   * @returns {Promise}
   */
  getByEmailSha1(email_sha1) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        email_sha1: {"$in": email_sha1}
      }, (err, user) => {
        if (err) {
          return reject('Error retrieving your account');
        }

        return resolve(user);
      });
    });
  }

  getByIdRessource(id_ressource){
    return new Promise((resolve, reject) => {
      Users.findOne({
        id_ressource: id_ressource
      }, (err, user) => {
        if (err) {
          return reject('Error retrieving your account');
        }

        return resolve(user);
      });
    });
  }

  setIdRessource(id, id_ressource){
    return new Promise((resolve, reject) => {
      Users.update({_id: id}, {
        $set: {
          id_ressource: id_ressource,
        }
      }, (err, userUpdated) => {
        if (err) {
          return reject('Error while editing your information');
        }

        return resolve(userUpdated);
      });
    });
  }

  remove(id){
    return new Promise((resolve, reject) => {
      Users.findOne({_id: id}, function (error, person){
        if(error){
          return reject('Error while deleting account');
        }

        if(!person){
          return reject('Error while deleting account');
        }

        person.remove();
        return resolve();
      });
    });
  }

  removeByEmail(email){
    return new Promise((resolve, reject) => {
      Users.findOne({email: email}, function (error, person){
        if(error){
          return reject('Error while deleting account');
        }

        if(!person){
          return reject('Error while deleting account');
        }

        person.remove();
        return resolve();
      });
    });
  }

  getByEmailAndIdSocialNetwork(email, id_social_network, type_social_network){
    return new Promise((resolve, reject) => {
      Users.findOne({
        email: email,
        id_social_network: id_social_network,
        type_social_network: type_social_network,
      }, (err, user) => {
        if(err){
          return reject('Error retrieving your account');
        }

        return resolve(user);
      });
    });
  }

  addBySocialNetwork(email, email_sha1, id_social_network, type_social_network, id_person_ressource){
    return new Promise((resolve, reject) => {
      const user = new Users({
        email: email,
        email_sha1: email_sha1,
        id_social_network: id_social_network,
        id_person_ressource: id_person_ressource,
        type_social_network: type_social_network,
      });

      user.save((err) => {
        if(err){
          return reject('Error creating your account');
        }

        return resolve(user);
      });
    });
  }

  getIdRessource(id_user){
    return new Promise((resolve, reject) => {
      Users.findOne({
        _id: id_user,
      }, (err, user) => {
        if(err){
          return reject('Error retrieving your account');
        }

        if(!user){
          return reject('Error retrieving your account');
        }

        return resolve(user.id_person_ressource);
      });
    });
  }
}

module.exports = UsersDao;