var express = require('express');
var router = express.Router();
var CypressSpecModel = require('../models/cypress-spec.model');

var multer = require('multer');
// set the directory for the uploads to the uploaded to
var storage = multer.diskStorage(
  {
    destination: './cypress/integration/',
    filename: function (req, file, cb) {
      cb(null, req.headers.cypress_spec_name);
    }
  }
);

var upload = multer({ storage: storage }).array('file', 1);

router.get('/', function (req, res, next) {
  // render the index page, and pass data to it.
  res.render('index', { title: 'Express' });
});

//our file upload function.
router.post('/', function (req, res, next) {

  //
  console.log('Uploading a cypress spec --> ', req.headers);
  var cypress_spec_data = JSON.parse(req.headers.cypress_spec_data);
  upload(req, res, function (err) {
    if (err) {
      console.log(JSON.stringify(err));
      return res.status(500).json({ error: err });
    }
    cypress_spec_data.size = +req.headers["content-length"];
    CypressSpecModel.create(cypress_spec_data, function (err, post) {
      if (err) {
        console.log(JSON.stringify(err));
        return res.status(500).send({ code: 500, message: err });
      }
      else {
        return res.status(200).send({ code: 200, cypressSpec: post });
      }
    });
  })
})
module.exports = router;