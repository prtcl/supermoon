
var EventEmitter = require('events');

var _ = {
    bind: require('lodash/function/bind'),
    create: require('lodash/object/create'),
    each: require('lodash/collection/each'),
    filter: require('lodash/collection/filter')
};

var vlfSites = require('app/data/vlf-sites');

function VlfSiteSelect (args) {
    args || (args = {});
    this.el = args.el;
    this.ui = { select: this.el.querySelector('select') };
    this.ui.select.addEventListener('change', _.bind(function (e) {
        var id = e.target.value;
        this.emit('selected', id);
    }, this));
}

VlfSiteSelect.prototype = _.create(EventEmitter.prototype, {
    render: function () {
        var df = document.createDocumentFragment();
        _.each(vlfSites, function (site) {
            var el = document.createElement('option');
            el.value = site.id;
            el.innerText = site.name + ' (' + [site.lat, site.lng].join(',') + ')';
            df.appendChild(el);
        }, this);
        this.ui.select.appendChild(df);
        var selected = this.el.querySelector('select option:checked');
        this.emit('selected', selected.value);
        return this;
    }
});



module.exports = VlfSiteSelect;
