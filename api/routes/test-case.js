var express = require('express');
var router = express.Router();
var TestCaseModel = require('../models/TestCase.model');
var fs = require('fs');
var AWS = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

AWS.config.update({
  secretAccessKey: process.env.koko_secret_key,
  accessKeyId: process.env.koko_key_id,
  region: 'us-east-1'
});

var bucketName = process.env.koko_data_bucket;
var s3 = new AWS.S3({ apiVersion: '2006-03-01' })
var s3PackagesFolder = "test-cases/";

//our file upload function.
router.post('/upload/', function (req, res, next) {

  //
  console.log('Uploading a cypress spec --> ', req.headers);
  var test_case_data = JSON.parse(req.headers.test_case_data);

  // set the directory for the uploads to the uploaded to
  var storage = multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${s3PackagesFolder}${test_case_data.type}/${req.headers.test_case_name}`)
    },
    acl: "public-read",
  })

  var upload = multer({ storage: storage }).array('file', 1);

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

router.post('/', function(req, res, next) {
  TestCaseModel.create(req.body, function (err, post) {
    if (err) {
      return res.status(500).send({ code: 500, message: err });
    }
    else {
      return res.status(200).send({ code: 200, cypressSpec: post });
    }
  });
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
  s3.getObject({Bucket: bucketName, Key: `test-cases/cypress/${req.params.file_name}`}, function(err, data) {
    if (err) {
      res.json({ code: 400, data: "No fue posible cargar el archivo" });
    } else {
      res.json({ code: 200, data: data.Body.toString('ascii') });
    }
  });
});

module.exports = router;