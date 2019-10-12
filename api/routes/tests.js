var express = require('express');
var router = express.Router();
const cypress = require('cypress')
const fs = require('fs');
const resemble = require('resemblejs');
const compareImages = require("resemblejs/compareImages");
const public_directory = "./public/";
var TestObject = require('../models/TestObject.model');
var CypressSpecModel = require('../models/cypress-spec.model');

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