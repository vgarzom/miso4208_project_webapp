var express = require('express');
var router = express.Router();
var AppCompilationModel = require('../models/AppCompilation');

var multer = require('multer');
// set the directory for the uploads to the uploaded to
var storage = multer.diskStorage(
  {
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, req.headers.compilation_name);
    }
  }
);

var upload = multer({ storage: storage }).single('file');

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