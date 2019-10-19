var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const resemble = require('resemblejs');
var TestObject = require('../models/TestObject.model');
var AWS = require('aws-sdk');

AWS.config.update({
  secretAccessKey: process.env.koko_secret_key,
  accessKeyId: process.env.koko_key_id,
  region: 'us-east-1'
});
// Create an SQS service 
const queueURL = process.env.koko_sqs_url;
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

router.post('/', function (req, res, next) {
  TestObject.create(req.body, function (err, testObject) {
    if (err) return next(err);
    res.json(testObject);

    var params = {
      DelaySeconds: 10,
      MessageAttributes: {},
      MessageBody: JSON.stringify({ type: testObject.type, test_id: testObject._id }),
      QueueUrl: queueURL
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("message enqueued");
      }
    });
  });
});

/* GET home page. */
var test_aggregation = [{
  $lookup: {
    from: 'test-cases',
    localField: 'case_id',
    foreignField: '_id',
    as: 'case'
  }
}, {
  $unwind: "$case"
}, {
  $lookup: {
    from: 'appcompilationmodels',
    localField: 'app_compilation_id',
    foreignField: '_id',
    as: 'compilation'
  }
}, {
  $unwind: "$compilation"
}, {
  $lookup: {
    from: 'users',
    localField: 'user_id',
    foreignField: '_id',
    as: 'user'
  }
}, {
  $unwind: "$user"
}, {
  $project: {
    "user.password": 0
  }
}];

router.get('/', function (req, res, next) {
  TestObject.aggregate([
    test_aggregation
  ], (err, products) => {
    if (err) next(err);
    res.json(products);
  }).sort('-creation_date');
});

router.get('/last', function (req, res, next) {
  TestObject.findOne(function (err, products) {
    if (err) {
      res.json({ code: 400, message: "Error consultando", error: err })
    } else {
      res.json(products);
    }
  }).sort('-creation_date');
});

router.get('/id/:id', function (req, res, next) {
  let aggregation = [{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }];
  TestObject.aggregate(aggregation.concat(test_aggregation), (err, testObjects) => {
    if (err) {
      res.json({ code: 400, message: "Error consultando", error: err })
    } else if (testObjects.length > 0) {
      res.json(testObjects[0]);
    } else {
      res.json({ code: 404, message: "Test not found" })
    }
  });
});

router.get('/appid/:appId', function (req, res, next) {
  //const appId = new ObjectId(req.params.appId);
  let aggregation = [{ $match: { app_id: mongoose.Types.ObjectId(req.params.appId) } }];
  TestObject.aggregate(aggregation.concat(test_aggregation), (err, products) => {
    if (err) next(err);
    res.json(products);
  }).sort('-creation_date');

});

module.exports = router;