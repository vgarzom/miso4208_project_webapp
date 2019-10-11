var mongoose = require('mongoose');

var AppCompilationSchema = new mongoose.Schema({
  app_id: String,
  file_name: String,
  size: Number,
  version: String,
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AppCompilationModel', AppCompilationSchema);