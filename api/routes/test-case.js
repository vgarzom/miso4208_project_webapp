var express = require('express');
var router = express.Router();
var TestCaseModel = require('../models/TestCase.model');
var fs = require('fs');
var multer = require('multer');
// set the directory for the uploads to the uploaded to
var storage = multer.diskStorage(
  {
    destination: './testcases/',
    filename: function (req, file, cb) {
      cb(null, req.headers.test_case_name);
    }
  }
);

var upload = multer({ storage: storage }).array('file', 1);

//our file upload function.
router.post('/', function (req, res, next) {

  //
  console.log('Uploading a cypress spec --> ', req.headers);
  var test_case_data = JSON.parse(req.headers.test_case_data);
  upload(req, res, function (err) {
    if (err) {
      console.log(JSON.stringify(err));
      return res.status(500).json({ error: err });
    }
    test_case_data.size = +req.headers["content-length"];
    TestCaseModel.create(test_case_data, function (err, post) {
      if (err) {
        console.log(JSON.stringify(err));
        return res.status(500).send({ code: 500, message: err });
      }
      else {
        return res.status(200).send({ code: 200, cypressSpec: post });
      }
    });
  })
});

router.get('/appid/:appId', function (req, res, next) {
  console.log("test");
  TestCaseModel.find({ app_id: req.params.appId }).sort({ created_date: -1 }).exec(function (err, test_cases) {
    if (err) return next(err);
    res.json(test_cases);
  });
});

/* GET SINGLE  BY ID */
router.get('/:id', function (req, res, next) {
  TestCaseModel.findById(req.params.id, function (err, test_case) {
    if (err) return next(err);
    res.json(test_case);
  });
});

router.get('/', function (req, res, next) {
  TestCaseModel.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).sort('-creation_date');
});

router.get('/raw/:file_name', function (req, res, next) {
  fs.readFile(`testcases/${req.params.file_name}`, 'utf8', function (err, data) {
    if (err) throw err;
    console.log('OK: ' + req.params.file_name);
    console.log(data)
    res.json({ data: data });
  });
});

module.exports = router;