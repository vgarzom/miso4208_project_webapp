var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Express RESTful API');
});

/**
 * Save a user
 */
router.post("/", (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(err);
    } else {
      if (user !== null) {
        res.json({ code: 202, message: 'email already exists!' });
        return;
      }
      User.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json({ code: 200, user: post });
      });
    }
  });
});

/**
 * Find a user by username and password
 */
router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email, password: req.body.password }, (err, user) => {
    if (err) {
      console.log("error-----> ", err);
      return next(err);
    } else {
      if (user === null) {
        res.json({ code: 201, message: 'Not user found' });
        return;
      }
      user.password = '';
      res.json({ code: 200, user: user });
    }
  });
});

module.exports = router;