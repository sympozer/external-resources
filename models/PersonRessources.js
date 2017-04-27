const mongoose = require('mongoose'),
  mongooseApiQuery = require('mongoose-api-query'),
  createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const PersonRessourcesSchema = new mongoose.Schema({
  lastname: {
    type: String,
    required: false,
  },
  firstname: {
    type: String,
    required: false,
  },
  photoUrl: {
    type: String,
    required: false,
  },
  twitterpage: {
    type: String,
    required: false,
  },
  facebookpage: {
    type: String,
    required: false,
  },
  googleaccount: {
    type: String,
    required: false,
  },
  linkedinaccount: {
    type: String,
    required: false,
  },
  homepage: {
    type: String,
    required: false,
  },
  id_ressource: {
    type: String,
    required: false,
  }
}, { minimize: false });


PersonRessourcesSchema.plugin(mongooseApiQuery);
PersonRessourcesSchema.plugin(createdModified, { index: true });

const PersonRessources = mongoose.model('PersonRessources', PersonRessourcesSchema);
module.exports = PersonRessources;