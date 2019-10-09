var mongoose = require('mongoose');

var CalabashFeatureSchema = new mongoose.Schema({
  name: String,
  description: String,
  file_name: String,
  size: Number,
  creation_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('CalabashFeatureModel', CalabashFeatureSchema);