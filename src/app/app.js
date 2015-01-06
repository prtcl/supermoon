
define(function (require) {

    var app = require('instances/app'),
        synthEngine = require('instances/synth-engine');

    var isCompatibleBrowser = require('utils/is-compatible-browser');

    app.inits.add(function () {
        if (!isCompatibleBrowser()) return this.failWithUnsupported();
        this.synthEngine = synthEngine;
        this.play();
    });

    app.play = function () {
        this.synthEngine.connectNodes();
        if (this.synthEngine.isReady()) this.synthEngine.play();
        return this;
    };

    app.failWithUnsupported = function () {

        return this;
    };

    return app;

});
