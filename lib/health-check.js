
const request = require('request'),
      plonk = require('plonk');

const debug = require('debug')('supermoon:health-check');

const vlfSites = require('app/data/vlf-sites');

function verifySite (site) {
  var def = plonk.defer();
  try {
    var req = request(site.url)
      .on('response', (res) => {
        var transferd = 0;
        res.on('data', (chunk) => {
          transferd += chunk.length;
        });
        plonk.wait(1000)
          .then(() => {
            site.healthy = (transferd >= 200);
            def.resolve(site);
            req && req.abort();
            res && res.destroy();
          });
      });
  } catch (err) {
    def.reject(err);
  }
  return def.promise;
}

module.exports = function (db) {

  function updateSite (site) {
    var def = plonk.defer();
    db.get('sites').update({ id: site.id }, site, { upsert: true })
      .error((err) => { def.reject(err); })
      .success(() => { def.resolve(site); });
    return def.promise;
  }

  function run () {
    vlfSites.forEach((s) => {
      verifySite(Object.create(s))
        .then((site) => {
          return updateSite(site);
        })
        .then((site) => {
          var status = (site.healthy ? 'ok' : 'fail');
          debug(`[${status}]`, site.name);
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  return {
    run: function () {
      run();
      plonk.metro(plonk.ms('1440m'), run);
    }
  };

};
