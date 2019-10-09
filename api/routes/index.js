console.log("loading routes")
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.status(200).send("API is working")
});

// Load here the whole api routes
router.use("/cypress-test", require("./cypress-test"));
router.use("/monkey-test", require("./monkey-test"));
router.use("/cypress-case", require("./cypress-case"));
router.use("/calabash-case", require("./calabash-case"));

module.exports = router;