const router = require('express').Router();
const utils = require('../controllers');
// const middleware = require('../middleware');

// router.use(middleware.allowCrossDomain);

router.get('/redeem', function(req, res) {
  bagelDeeplink = utils.getBagelDeeplink(req.query.url);
  utils.getBagelData(bagelDeeplink, res);
});

router.get('/bagels', function(req, res) {
  utils.getBagelId(req.query.profile, res);
});

// TODO: change to post
router.get('/like', function(req, res) {
  utils.likeBagel(req.query.profile, req.query.long_id, res);
});

module.exports = router;