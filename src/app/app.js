
define(function (require) {

    var app = require('instances/app'),
        synthEngine = require('instances/synth-engine');

    var isCompatibleBrowser = require('utils/is-compatible-browser');

    var visualizationSketch = require('views/visualization-sketch');

    app.ui = { visualizationContainer: '#visualization-container' };
    app.inits.add(function () {
        $.each(this.ui, function (name, id) { app.ui[name] = $(id); });
    });

    app.inits.add(function () {
        if (!isCompatibleBrowser()) return this.failWithUnsupported();
        this.synthEngine = synthEngine;
        this.play();
    });

    app.play = function () {
        this.synthEngine.connectNodes();
        if (this.synthEngine.isReady()) this.synthEngine.play();
        var canvas = this.ui.visualizationContainer;
        this.visualizationView = new Processing(canvas[0], visualizationSketch);
        function resizeVisualization () {
            app.visualizationView.size(canvas.width(), canvas.height());
        }
        resizeVisualization();
        $(window).on('resize', plonk.limit(100, resizeVisualization));
        return this;
    };

    app.failWithUnsupported = function () {

        return this;
    };

    return app;

});
