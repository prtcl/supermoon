
var express = require('express'),
    router = express.Router();

var _ = { findWhere: require('lodash/collection/findWhere') };

var vlfSites = require('app/data/vlf-sites');

router.get('/sites', function (req, res){
  res.send(vlfSites);
});

router.get('/sites/:id', function (req, res) {
  var id = req.params.id, site = _.findWhere(vlfSites, { id: id });
  if (!site) return res.status(404).send({ status: 'Not Found' });
  res.send(site);
});

module.exports = router;
