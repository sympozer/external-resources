const mongoose = require('mongoose'),
  mongooseApiQuery = require('mongoose-api-query'),
  createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const AdminsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { minimize: false });


AdminsSchema.plugin(mongooseApiQuery);
AdminsSchema.plugin(createdModified, { index: true });

const Admins = mongoose.model('Admins', AdminsSchema);
module.exports = Admins;