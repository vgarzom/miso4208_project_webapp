var express = require('express');
var router = express.Router();
var ApplicationModel = require('../models/Application');

/* GET ALL APPLICATION */
router.get('/', function (req, res, next) {
  ApplicationModel.find(function (err, applications) {
    if (err) return next(err);
    res.json(applications);
  });
});

/* GET ALL APPLICATION */
router.get('/byuserid/:user_id', function (req, res, next) {
  ApplicationModel.find({ user_id: req.params.user_id }, function (err, applications) {
    if (err) return next(err);
    res.json(applications);
  });
});

/* GET SINGLE APPLICATION BY ID */
router.get('/:id', function (req, res, next) {
  ApplicationModel.findById(req.params.id, function (err, application) {
    if (err) return next(err);
    res.json(application);
  });
});

/* SAVE APPLICATION */
router.post('/', function (req, res, next) {
  ApplicationModel.create(req.body, function (err, application) {
    if (err) return next(err);
    res.json(application);
  });
});

/* UPDATE APPLICATION */
router.put('/:id', function (req, res, next) {
  ApplicationModel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE APPLICATION */
router.delete('/:id', function (req, res, next) {
  ApplicationModel.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;