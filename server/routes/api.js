const router = require('express').Router();
var utils = require('../controllers');
// var middleware = require('../middleware');

// router.use(middleware.allowCrossDomain);

router.get('/redeem', function(req, res) {
  bagelDeeplink = utils.getBagelDeeplink(req.query.url);
  utils.getBagelData(bagelDeeplink, res);
});

module.exports = router;