const mongoose = require('mongoose'),
  mongooseApiQuery = require('mongoose-api-query'),
  createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const UsersAuthorizeToVoteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
}, { minimize: false });


UsersAuthorizeToVoteSchema.plugin(mongooseApiQuery);
UsersAuthorizeToVoteSchema.plugin(createdModified, { index: true });

const UsersAuthorizeToVote = mongoose.model('UsersAuthorizeToVote', UsersAuthorizeToVoteSchema);
module.exports = UsersAuthorizeToVote;