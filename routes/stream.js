const express = require('express');
const db = require('../db');
const RadioStreamer = require('../lib/RadioStreamer');
const router = express.Router();

router.get('/:id', (req, res) => {
  db.get('sites').findOne({ id: req.params.id })
    .then((site) => {
      if (!site || !site.isHealthy) {
        throw new Error('Site is down');
      }
      return RadioStreamer.subscribe(site.url);
    })
    .then((stream) => {
      req.on('close', () => stream.stop());
      res.status(200).type(stream.type);
      stream.pipe(res);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

module.exports = router;
