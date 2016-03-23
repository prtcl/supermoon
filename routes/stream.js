
var express = require('express'),
    router = express.Router();

var _ = { findWhere: require('lodash/collection/findWhere') };

var vlfSites = require('app/data/vlf-sites'),
    RadioStreamer = require('app/lib/radio-streamer');

var radioSteamer = new RadioStreamer();

router.get('/', function (req, res) {
  var id = req.query.id || '',
      type = req.query.type || 'ogg',
      vlfSite = _.findWhere(vlfSites, { id: id });
  if (!id || !vlfSite) return res.status(404).send('Stream Not Found');
  radioSteamer.subscribe(vlfSite.url, type, req, res);
});

module.exports = router;
