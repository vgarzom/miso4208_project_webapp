var express = require('express');
var router = express.Router();
const fs = require('fs');
const resemble = require('resemblejs');
const compareImages = require("resemblejs/compareImages");
const public_directory = "./public/";
var TestObject = require('../models/TestObject.model');
var TestCaseModel = require('../models/TestCase.model');

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


router.post('/', function(req, res, next) {
  TestObject.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
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


router.get('/', function (req, res, next) {
  TestObject.find(function (err, products) {
    if (err) return next(err);
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
  TestObject.findById(req.params.id, function (err, post) {
    if (err) {
      res.json({ code: 400, message: "Error consultando", error: err })
    } else {
      res.json(post);
    }
  });
});

router.get('/appid/:appId', function (req, res, next) {
  console.log("test");
  TestObject.find({ app_id: req.params.appId }).sort({ created_date: -1 }).exec(function (err, tests) {
    if (err) return next(err);
    res.json(tests);
  });
});

module.exports = router;