
const EventEmitter = require('events');

const _ = { findWhere: require('lodash/collection/findWhere') };

function VlfSiteSelect (el, args) {
  args || (args = {});
  this.el = el;
  this.ui = { select: this.el.querySelector('select') };
  this.ui.select.addEventListener('change', (e) => {
    var id = e.target.value;
    this.emit('selected', id);
  });
}

VlfSiteSelect.prototype = Object.create(EventEmitter.prototype);

VlfSiteSelect.prototype.render = function (sites) {
  var df = document.createDocumentFragment();
  sites.forEach((site) => {
    var el = document.createElement('option');
    el.value = site.id;
    el.innerHTML = `${site.name} (${site.lat}, ${site.lng})`;
    df.appendChild(el);
  });
  this.ui.select.appendChild(df);
  this.el.classList.remove('hidden');
  var selected = this.el.querySelector('select option:checked'),
  this.emit('selected', selected.value);
  return this;
};

module.exports = VlfSiteSelect;
