/**
 * Created by pierremarsot on 27/04/2017.
 */
const mongoose = require('mongoose'),
  mongooseApiQuery = require('mongoose-api-query'),
  createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const VoteSchema = new mongoose.Schema({
  id_user: {
    type: String,
    required: true,
    trim: true,
  },
  id_ressource: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
}, { minimize: false });


VoteSchema.plugin(mongooseApiQuery);
VoteSchema.plugin(createdModified, { index: true });

const Votes = mongoose.model('Votes', VoteSchema);
module.exports = Votes;