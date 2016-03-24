
const EventEmitter = require('events');

const _ = { findWhere: require('lodash/collection/findWhere') };

const vlfSites = require('app/data/vlf-sites');

function VlfSiteSelect (el, args) {
  args || (args = {});
  this.el = el;
  this.ui = { select: this.el.querySelector('select') };
  this.ui.select.addEventListener('change', (e) => {
    var id = e.target.value,
    site = _.findWhere(vlfSites, { id: id });
    this.emit('selected', site);
  });
}

VlfSiteSelect.prototype = Object.create(EventEmitter.prototype);

VlfSiteSelect.prototype.render = function () {
  var df = document.createDocumentFragment();
  vlfSites.forEach((site) => {
    var el = document.createElement('option');
    el.value = site.id;
    el.innerHTML = `${site.name} (${site.lat}, ${site.lng})`;
    df.appendChild(el);
  });
  this.ui.select.appendChild(df);
  this.el.classList.remove('hidden');
  var selected = this.el.querySelector('select option:checked'),
  site = _.findWhere(vlfSites, { id: selected.value });
  this.emit('selected', site);
  return this;
};

module.exports = VlfSiteSelect;
