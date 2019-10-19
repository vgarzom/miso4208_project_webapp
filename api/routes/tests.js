var express = require('express');
var router = express.Router();
const fs = require('fs');
var mongoose = require('mongoose');
const resemble = require('resemblejs');
const compareImages = require("resemblejs/compareImages");
const public_directory = "./public/";
var TestObject = require('../models/TestObject.model');
var TestCaseModel = require('../models/TestCase.model');
var AWS = require('aws-sdk');

AWS.config.update({
  secretAccessKey: process.env.koko_secret_key,
  accessKeyId: process.env.koko_key_id,
  region: 'us-east-1'
});
// Create an SQS service 
const queueURL = process.env.koko_sqs_url;
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function compareImgs(img1, img2, oncomplete) {
  var diff = resemble(`./public/${img1}.png`)
    .compareTo(`./public/${img2}.png`)
    .onComplete(oncomplete);
}


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
/*
router.post('/', function (req, res, next) {

  TestCaseModel.findById(req.body.case_id, function (err, test_case) {
    if (err) {
      res.json({ code: 400, message: "Error consultando", error: err })
    } else {
      TestObject.create(req.body, function (err, newTest) {
        if (err) return next(err);
        console.log("newTest", newTest);
        cypress.run({
          spec: `./cypress/integration/${test_case.file_name}`,
          config: {
            video: false
          }
        })
          .then((results) => {
            console.log("results", results);
            let data = results.runs[0];
            let id = makeid(12);
            if (data.error === null) {
              data.screenshots.map((s, i) => {
                s.name = `${id}_${i}.png`;
                if (!fs.existsSync(public_directory)) {
                  fs.mkdirSync(public_directory);
                }
                fs.copyFile(s.path, `${public_directory}${s.name}`, (err) => {
                  if (err) throw err;
                  s.path = `${public_directory}${s.name}`;
                });
              });

              newTest.reporterStats = data.reporterStats;
              newTest.error = data.error;
              newTest.screenshots = data.screenshots;
              if (newTest.reporterStats.passes === newTest.reporterStats.tests) {
                newTest.status = "success";
              } else {
                newTest.status = "failed";
              }

              newTest.save().then(result => {
                res.send({
                  code: 200,
                  data: result
                });
              }).catch(err => {
                console.log("err", err);
                res.send({
                  code: 201,
                  data: {
                    reporterStats: data.reporterStats,
                    error: data.error
                  }
                });
              });
            } else {
              res.send({
                code: 201,
                data: {
                  reporterStats: data.reporterStats,
                  error: data.error
                }
              });
            }
          })
          .catch((err) => {
            console.log("err", err);
            res.send({
              code: 202,
              error: err
            });
          })

      });
    }
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