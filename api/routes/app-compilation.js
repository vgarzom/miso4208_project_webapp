var express = require('express');
var router = express.Router();
var AppCompilationModel = require('../models/AppCompilation');

router.get('/', function (req, res, next) {
  AppCompilationModel.find(function (err, applications) {
    if (err) return next(err);
    res.json(applications);
  });
});

/* GET BY app_id AND version */
router.get('/:app_id/:version', function (req, res, next) {
  AppCompilationModel.find({ app_id: req.params.app_id, version: req.params.version }, function (err, applications) {
    if (err) return next(err);
    res.json(applications);
  });
});

router.get('/:appId', function (req, res, next) {
  console.log("test");
  AppCompilationModel.find({ app_id: req.params.appId }).sort({created_date: -1}).exec(function (err, applications) {
    if (err) return next(err);
    res.json(applications);
  });
});

/* GET SINGLE APPLICATION BY ID */
router.get('/:id', function (req, res, next) {
  AppCompilationModel.findById(req.params.id, function (err, application) {
    if (err) return next(err);
    res.json(application);
  });
});

/* SAVE COMPILATION */
router.post('/', function (req, res, next) {
  AppCompilationModel.create(req.body, function (err, application) {
    if (err) return next(err);
    res.json(application);
  });
});

module.exports = router;