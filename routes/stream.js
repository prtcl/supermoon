
const express = require('express'),
      router = express.Router();

const _ = { findWhere: require('lodash/collection/findWhere') };

const vlfSites = require('app/data/vlf-sites'),
      RadioStreamer = require('app/lib/radio-streamer');

const radioSteamer = new RadioStreamer();

router.get('/', (req, res) => {
  var id = req.query.id || '',
      type = req.query.type || 'ogg',
      vlfSite = _.findWhere(vlfSites, { id: id });
  if (!id || !vlfSite) return res.status(404).send('Stream Not Found');
  radioSteamer.subscribe(vlfSite.url, type)
    .then(function (stream) {
      res.status(200).type(stream.type);
      stream.pipe(res);
      req.on('close', () => { stream.stop(); });
    })
    .catch(function (err) {
      res.status(500).send(err.message);
      throw err;
    });
});

module.exports = router;
