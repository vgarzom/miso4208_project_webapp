var mongoose = require('mongoose');

var ApplicationSchema = new mongoose.Schema({
  name: String,
  description: String,
  bundle_id: String,
  so: String,
  type: String,
  url: String,
  status: {type: String, default: 'in_progress'},
  updated_date: { type: Date, default: Date.now },
  created_date: { type: Date, default: Date.now },
  user_id: {type: String, required: true}
});

module.exports = mongoose.model('ApplicationModel', ApplicationSchema);