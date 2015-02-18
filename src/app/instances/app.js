
define(function (require) {

    var app = {
        inits: $.Callbacks('once memory'),
        run: function (options) {
            options || (options = {});
            $.each(this.ui, function (name, id) { app.ui[name] = $(id); });
            this.inits.fireWith(this, options);
            return this;
        }
    };

    return app;

});
