var express = require('express');
var router = express.Router();
var CalabashFeatureModel = require('../models/calabash-feature.model');

var multer = require('multer');
// set the directory for the uploads to the uploaded to
var storage = multer.diskStorage(
  {
    destination: './calabash-features/',
    filename: function (req, file, cb) {
      cb(null, req.headers.calabash_feature_name);
    }
  }
);

var upload = multer({ storage: storage }).array('file', 1);

//our file upload function.
router.post('/', function (req, res, next) {

  //
  console.log('Uploading a cypress spec --> ', req.headers);
  var data = JSON.parse(req.headers.calabash_feature_data);
  upload(req, res, function (err) {
    if (err) {
      console.log(JSON.stringify(err));
      return res.status(500).json({ error: err });
    }
    data.size = +req.headers["content-length"];
    CalabashFeatureModel.create(data, function (err, post) {
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

router.get('/', function (req, res, next) {
  CalabashFeatureModel.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  }).sort('-creation_date');
});

module.exports = router;