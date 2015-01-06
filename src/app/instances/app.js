
define(function (require) {

    var app = {
        inits: $.Callbacks('once memory'),
        events: _.clone(Backbone.Events),
        run: function (options) {
            options || (options = {});
            this.inits.fireWith(this, options);
            return this;
        }
    };

    return app;

});
