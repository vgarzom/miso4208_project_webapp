var mongoose = require('mongoose');

var TestCaseSchema = new mongoose.Schema({
  name: String,
  app_id: {type: String, require: true},
  type: {type: String, require: true},
  description: String,
  file_name: String,
  size: Number,
  creation_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('TestCaseModel', TestCaseSchema, 'test-cases');