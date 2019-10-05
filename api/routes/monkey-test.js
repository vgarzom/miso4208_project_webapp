var express = require('express');
var router = express.Router();
var MonkeyTest = require('../models/monkey-test.model');

/* GET ALL BOOKS */
router.get('/', function(req, res, next) {
  MonkeyTest.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).sort('-creation_date');
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {
  MonkeyTest.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE BOOK */
router.post('/', function(req, res, next) {
  MonkeyTest.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {
  MonkeyTest.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE BOOK */
router.delete('/:id', function(req, res, next) {
  MonkeyTest.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;