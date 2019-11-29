var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ResembleDataSchema = new mongoose.Schema({
  test_id: {type: ObjectId, required: true},
  other_test_id: {type: ObjectId, require: true},
  screenshot_index: {type: Number, require: true},
  screenshots_names: [String],
  image_url: String,
  result: Object,
  creation_date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ResembleData', ResembleDataSchema, 'resemble-data');