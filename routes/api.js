const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/sites', (req, res) => {
  db.get('sites').find({})
    .then((data) => {
      res.status(200).json(data.sort((a, b) => a.id - b.id));
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
