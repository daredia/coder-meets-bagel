const router = require('express').Router();
const utils = require('../controllers');
// const middleware = require('../middleware');

// router.use(middleware.allowCrossDomain);

// TODO: change endpoint names to make more sense
router.get('/redeem', function(req, res) {
  bagelDeeplink = utils.getBagelDeeplink(req.query.url);
  utils.getBagelData(bagelDeeplink, res);
});

/* TEST ROUTES FOR UNIT TESTING KEY FUNCTIONALITY */
router.get('/get_bagel_data_test', function(req, res) {
  bagelDeeplink = utils.getBagelDeeplink(req.query.url);
  utils.getBagelData(bagelDeeplink, res, {test: true});
});

router.post('/create_bagel_test', function(req, res) {
  utils.createBagel(req.body, res, {test: true});
});

router.get('/get_bagel_id_test', function(req, res) {
  utils.getBagelId(req.query.profile, res, {test: true});
});

// TODO: change to post
router.get('/like_bagel_test', function(req, res) {
  utils.likeBagel(req.query.profile, req.query.long_id, res);
});
/* END TEST ROUTES */

module.exports = router;