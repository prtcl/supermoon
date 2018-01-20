const request = require('request');
const plonk = require('plonk');
const debug = require('debug')('supermoon:health-check');
const vlfSites = require('../data/sites');
const db = require('../db');

const countTransferred = (res) => {
  let transferred = 0;
  res.on('data', (chunk) => {
    transferred += chunk.length;
  });
  return plonk.wait(1000)
    .then(() => transferred);
};

const verifySite = (site) => new Promise((resolve, reject) => {
  const req = request(site.url)
    .on('response', (res) => {
      countTransferred(res)
        .then((transferred) => resolve(transferred >= 200))
        .then(() => {
          req.abort();
          res.destroy();
        })
        .catch(reject);
    })
    .on('error', (err) => {
      req.abort();
      reject(err);
    });
});

const updateSite = (site) => db.get('sites')
  .update({ id: site.id }, site, { upsert: true })
  .then(() => site);

const logSiteStatus = (site) => {
  const status = site.isHealthy ? 'ok' : 'fail';
  debug(`[${status}]`, site.name);
};

const logSiteError = (err) => {
  debug('[error]', err.message);
};

const run = () => {
  vlfSites.forEach((site) => {
    console.log(site);
    verifySite(site)
      .then((isHealthy) => Object.assign({}, site, { isHealthy }))
      .then(updateSite)
      .then(logSiteStatus)
      .catch(logSiteError);
  });
};

module.exports = {
  run () {
    plonk.metro(plonk.ms('1440m'), run);
  }
};
