var express = require('express');
var router = express.Router();
var AppCompilationModel = require('../models/AppCompilation');
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
var s3PackagesFolder = "mobile-packages/";

// set the directory for the uploads to the uploaded to

var storage = multerS3({
  s3: s3,
  bucket: bucketName,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, `${s3PackagesFolder}${req.headers.compilation_name}`)
  },
  acl: "public-read",
})

var upload = multer({ storage: storage }).array('file', 1);

router.get('/', function (req, res, next) {
  // render the index page, and pass data to it.
  res.render('index', { title: 'Express' });
});

//our file upload function.
router.post('/', function (req, res, next) {

  var compilation_data = JSON.parse(req.headers.compilation_data);
  console.log('Uploading a compilation --> ', compilation_data);

  upload(req, res, function (err) {
    if (err) {
      console.log(JSON.stringify(err));
      return res.status(500).json({ error: err });
    }
    compilation_data.size = +req.headers["content-length"];
    AppCompilationModel.create(compilation_data, function (err, post) {
      if (err) {
        console.log(JSON.stringify(err));
        return res.status(500).send({ code: 500, message: err });
      }
      else {
        return res.status(200).send({ code: 200, compilation: post });
      }
    });
  })
})
module.exports = router;