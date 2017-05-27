/**
 * Created by pierremarsot on 27/04/2017.
 */
const PersonRessources = require('../models/PersonRessources');

class PersonRessourceDao {
  constructor(){

  }

  find(){
    return new Promise((resolve, reject) => {
      PersonRessources.find({}, (error, personsRessources) => {
        if(error){
          return reject('Error recovering resources');
        }

        return resolve(personsRessources);
      });
    });
  }

  get(id){
    return new Promise((resolve, reject) => {
      PersonRessources.findOne({_id: id}, (err, personRessource) => {
        if(err){
          return reject('Error recovering resource');
        }

        return resolve(personRessource);
      });
    });
  }

  getByIdRessource(id){
    return new Promise((resolve, reject) => {
      PersonRessources.findOne({id_ressource: id}, (err, personRessource) => {
        if(err){
          return reject('Error recovering resource');
        }

        return resolve(personRessource);
      });
    });
  }

  update(personRessource) {
    return new Promise((resolve, reject) => {

      PersonRessources.update({_id: personRessource._id}, {
        $set: {
          lastname: personRessource.lastname,
          firstname: personRessource.firstname,
          twitterpage: personRessource.twitterpage,
          facebookpage: personRessource.facebookpage,
          googleaccount: personRessource.googleaccount,
          linkedinaccount: personRessource.linkedinaccount,
          homepage: personRessource.homepage,
          photoUrl: personRessource.photoUrl,
        }
      }, (err, personRessourceUpdated) => {
        if (err) {
          return reject('Error while editing your information');
        }

        return resolve(personRessourceUpdated);
      });
    });
  }

  createByDefault(){
    return new Promise((resolve, reject) => {
      const personRessource = new PersonRessources();
      personRessource.save((err) => {
        if(err){
          return reject('Error creating resource');
        }

        return resolve(personRessource);
      });
    });
  }

  adminCreate(id_ressource){
    return new Promise((resolve, reject) => {
      const personRessource = new PersonRessources({
        id_ressource: id_ressource,
      });
      personRessource.save((err) => {
        if(err){
          return reject('Error creating resource');
        }

        return resolve(personRessource);
      });
    });
  }

  mergeInformations(personRessource){
    return new Promise((resolve, reject) => {
      PersonRessources.update({_id: personRessource._id}, {
        $set: {
          firstname: personRessource.firstname,
          lastname: personRessource.lastname,
          photoUrl: personRessource.photoUrl,
          twitterpage: personRessource.twitterpage,
          facebookpage: personRessource.facebookpage,
          googleaccount: personRessource.googleaccount,
          linkedinaccount: personRessource.linkedinaccount,
          homepage: personRessource.homepage,
          id_ressource: personRessource.id_ressource,
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
      PersonRessources.findOne({_id: id}, function (error, personRessource){
        if(error){
          return reject('Error while deleting account');
        }

        if(!personRessource){
          return reject('Error while deleting account');
        }

        personRessource.remove();
        return resolve();
      });
    });
  }

  setIdRessource(id, id_ressource){
    return new Promise((resolve, reject) => {
      PersonRessources.update({_id: id}, {
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
}

module.exports = PersonRessourceDao;