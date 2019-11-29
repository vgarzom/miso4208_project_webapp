var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const resemble = require('resemblejs');
var ResembleData = require('../models/ResembleData.model.js');
var AWS = require('aws-sdk');

var images_base_url = "https://koko-testing-storage.s3.us-east-2.amazonaws.com/images/";

AWS.config.update({
  secretAccessKey: process.env.koko_secret_key,
  accessKeyId: process.env.koko_key_id,
  region: 'us-east-1'
});

var bucketName = process.env.koko_data_bucket;
var s3 = new AWS.S3({ apiVersion: '2006-03-01' })

router.post('/', function (req, res, next) {

  ResembleData.findOne(req.body, (err, result) => {
    if (err) return next(err);

    if (result !== null) {
      return res.json(result);
    }

    compareImgs(req.body.screenshots_names[0], req.body.screenshots_names[1], (data) => {
      req.body.result = data;

      s3.putObject({
        Bucket: bucketName,
        Key: `comparisons/${req.body.test_id}_${req.body.other_test_id}_${req.body.screenshot_index}.png`,
        Body: data.getBuffer(),
        ACL: 'public-read'
      }, function (resp) {
        console.log('Successfully uploaded package.');
        ResembleData.create(req.body, function (err, cresult) {
          if (err) return next(err);
          res.json(cresult);
        });
      });


    })
  })



});

function compareImgs(img1, img2, oncomplete) {
  resemble(`${images_base_url}${img1}`)
    .compareTo(`${images_base_url}${img2}`)
    .onComplete(oncomplete);
}

module.exports = router;
