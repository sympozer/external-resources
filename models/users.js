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
    required: true,
  },
  lastname: {
    type: String,
    required: false,
  },
  firstname: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  avatar_view: {
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
  },
}, { minimize: false });


UsersSchema.plugin(mongooseApiQuery);
UsersSchema.plugin(createdModified, { index: true });

const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;