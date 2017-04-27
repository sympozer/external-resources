const mongoose = require('mongoose'),
  mongooseApiQuery = require('mongoose-api-query'),
  createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  email_sha1: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: false,
  },
  id_social_network: {
    type: String,
    required: false,
  },
  type_social_network: {
    type: String,
    enum: ['google', 'facebook', 'linkedin', 'twitter'],
    required: false,
  },
  id_person_ressource: {
    type: String,
    required: true,
  },
}, { minimize: false });


UsersSchema.plugin(mongooseApiQuery);
UsersSchema.plugin(createdModified, { index: true });

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;