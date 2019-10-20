var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var AppCompilationSchema = new mongoose.Schema({
  app_id: {type: ObjectId, required: true},
  file_name: String,
  size: Number,
  url: String,
  version: String,
  description: String,
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AppCompilationModel', AppCompilationSchema);