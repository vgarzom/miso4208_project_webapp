console.log("loading routes")
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.status(200).send("API is working")
});

// Load here the whole api routes
router.use("/monkey-test", require("./monkey-test"));
router.use("/cypress-case", require("./cypress-case"));
router.use("/calabash-case", require("./calabash-case"));
router.use("/user", require("./user"));
router.use("/applications", require("./applications"));
router.use("/upload-package", require("./upload-package"));
router.use("/app-compilation", require("./app-compilation"));
router.use("/test-case", require("./test-case"));
router.use("/tests", require("./tests"));
router.use("/resemble", require("./resemble"));


module.exports = router;