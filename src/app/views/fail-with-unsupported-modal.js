
define(function (require) {

    var template = require('text!templates/fail-with-unsupported-modal.hbs');

    return Backbone.View.extend({
        className: 'modal-container fail-with-unsupported-modal',
        template: Handlebars.compile(template),
        render: function () {
            var html = this.template({});
            this.$el
                .empty()
                .append(html);
            return this;
        }
    });

});
