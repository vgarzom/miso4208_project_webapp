var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TestObjectSchema = new mongoose.Schema({
  type: String,
  reporterStats: Object,
  calabash: Object,
  error: String,
  screenshots: [Object],
  user_id: { type: ObjectId, required: true },
  case_id: { type: ObjectId },
  app_id: { type: ObjectId, required: true },
  app_compilation_id: { type: ObjectId },
  resemble: [Object],
  creation_date: { type: Date, default: Date.now },
  status: { type: String, default: 'new' },
  result: {type: String},
  start_date: Date,
  end_date: Date,
  video: {type: Boolean, default: false}
});

module.exports = mongoose.model('TestObject', TestObjectSchema, 'test-objects');