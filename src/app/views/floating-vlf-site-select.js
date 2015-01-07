
define(function (require) {

    var vlfSites = require('data/vlf-sites');

    var template = require('text!templates/floating-vlf-site-select.hbs');

    return Backbone.View.extend({
        className: 'floating-vlf-site-select',
        template: Handlebars.compile(template),
        events: { 'change select': 'selectVlfSite' },
        initialize: function () {
            _.bindAll(this, 'selectVlfSite');
            var sites = [];
            _.each(vlfSites, function (obj) {
                sites.push(_.clone(obj));
            });
            this.model = new Backbone.Model({ sites: sites });
        },
        render: function () {
            var data = this.model.toJSON(),
                html = this.template(data);
            this.$el
                .empty()
                .append(html);
            return this;
        },
        selectVlfSite: function (e) {
            var el = $(e.target),
                url = el.val(),
                siteObject = _.findWhere(this.model.get('sites'), { url: url });
            this.trigger('site-selected', { model: siteObject });
            return this;
        }
    });

});
