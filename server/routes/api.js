var router = require('express').Router();
// var utils = require('../controllers');
// var middleware = require('../middleware');

// router.use(middleware.allowCrossDomain);

router.get('/redeem', function(req, res) {
  res.status(200).json(req.query);
});

module.exports = router;