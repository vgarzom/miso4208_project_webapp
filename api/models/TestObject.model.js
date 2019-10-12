var mongoose = require('mongoose');

var TestObjectSchema = new mongoose.Schema({
  reporterStats: Object,
  error: String,
  screenshots: [Object],
  user_id: String,
  case_id: String,
  app_id: String,
  app_compilation_id: String,
  resemble: [Object],
  creation_date: {type: Date, default: Date.now},
  status: {type: String, default: 'in-progress'}
});

module.exports = mongoose.model('TestObject', TestObjectSchema, 'test-objects');