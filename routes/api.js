
const express = require('express'),
      router = express.Router();

var _ = require('lodash');

module.exports = function (db) {

  router.get('/sites', function (req, res) {
    db.get('sites').find({})
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      })
      .on('success', (docs) => {
        var sites = _.sortBy(docs, site => site.id);
        res.status(200).json(sites);
      });
  });

  return router;
};
