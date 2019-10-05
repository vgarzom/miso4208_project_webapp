var mongoose = require('mongoose');

var MonkeyTestSchema = new mongoose.Schema({
  error: String,
  requester: String,
  type: String,
  creation_date: {type: Date, default: Date.now},
  status: {type: String, default: 'new'},
  monkeys: Number,
  package: String,
  start: Date,
  end: Date,
  seed: Number
});

module.exports = mongoose.model('MonkeyTest', MonkeyTestSchema, 'monkey_tests');