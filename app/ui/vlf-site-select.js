
var EventEmitter = require('events');

var _ = {
    bind: require('lodash/function/bind'),
    create: require('lodash/object/create'),
    each: require('lodash/collection/each'),
    findWhere: require('lodash/collection/findWhere')
};

var vlfSites = require('app/data/vlf-sites');

function VlfSiteSelect (args) {
    args || (args = {});
    this.el = args.el;
    this.ui = { select: this.el.querySelector('select') };
    this.ui.select.addEventListener('change', _.bind(function (e) {
        var id = e.target.value,
            site = _.findWhere(vlfSites, { id: id });
        this.emit('selected', site);
    }, this));
}

VlfSiteSelect.prototype = _.create(EventEmitter.prototype, VlfSiteSelect.prototype);

VlfSiteSelect.prototype.render = function () {
    var df = document.createDocumentFragment();
    _.each(vlfSites, function (site) {
        var el = document.createElement('option');
        el.value = site.id;
        el.innerHTML = site.name + ' (' + [site.lat, site.lng].join(',') + ')';
        df.appendChild(el);
    }, this);
    this.ui.select.appendChild(df);
    this.el.classList.remove('hidden');
    var selected = this.el.querySelector('select option:checked'),
        site = _.findWhere(vlfSites, { id: selected.value });
    this.emit('selected', site);
    return this;
};

module.exports = VlfSiteSelect;
