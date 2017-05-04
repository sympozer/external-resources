const mongoose = require('mongoose'),
  mongooseApiQuery = require('mongoose-api-query'),
  createdModified = require('mongoose-createdmodified').createdModifiedPlugin;

const TrackRessourcesSchema = new mongoose.Schema({
  label: {
    type: String,
    required: false,
  },
  id_ressource: {
    type: String,
    required: false,
  },
  chairs: [],
}, { minimize: false });


TrackRessourcesSchema.plugin(mongooseApiQuery);
TrackRessourcesSchema.plugin(createdModified, { index: true });

const TrackRessources = mongoose.model('TrackRessources', TrackRessourcesSchema);
module.exports = TrackRessources;