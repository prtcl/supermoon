const request = require('request');
const plonk = require('plonk');
const debug = require('debug')('supermoon:health-check');
const vlfSites = require('../data/sites');
const db = require('../db');

const verifySite = (site) => new Promise((resolve, reject) => {
  const req = request.get(site.url)
    .on('response', (res) => {
      let transferd = 0;
      res.on('data', (chunk) => {
        transferd += chunk.length;
      });
      plonk.wait(1000)
        .then(() => {
          site.isHealthy = (transferd >= 200);
          resolve(site);
          req && req.abort();
          res && res.destroy();
        });
    })
    .on('error', (err) => {
      req.abort();
      reject(err);
    });
});

const updateSite = (site) => db.get('sites')
  .update({ id: site.id }, site, { upsert: true })
  .then(() => site);

const run = () => {
  vlfSites.forEach((s) => {
    verifySite({ ...s })
      .then((site) => updateSite(site))
      .then((site) => {
        const status = (site.isHealthy ? 'ok' : 'fail');
        debug(`[${status}]`, site.name);
      })
      .catch((err) => {
        debug('[error]', err.message);
      });
  });
};

module.exports = {
  run () {
    plonk.metro(plonk.ms('1440m'), run);
  }
};
