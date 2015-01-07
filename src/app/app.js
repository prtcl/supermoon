
define(function (require) {

    var app = require('instances/app'),
        synthEngine = require('instances/synth-engine');

    var isCompatibleBrowser = require('utils/is-compatible-browser');

    var VisualizationSketch = require('views/visualization-sketch'),
        FloatingSiteSelectView = require('views/floating-vlf-site-select');

    app.ui = {
        visualizationContainer: '#visualization-container',
        controlsContainer: '#controls-container'
    };
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
        var visualizationSketch = new VisualizationSketch();
        this.ui.visualizationContainer
            .empty()
            .append(visualizationSketch.el);
        var siteSelectView = new FloatingSiteSelectView();
        this.ui.controlsContainer
            .empty()
            .append(siteSelectView.el);
        siteSelectView.on('site-selected', function (args) {
            if (!args.model) return;
            synthEngine.setStreamSource(args.model.url);
        });
        if (this.synthEngine.isReady()) {
            var selectedVlfSite = siteSelectView.model.get('sites')[0];
            this.synthEngine
                .setStreamSource(selectedVlfSite.url)
                .play();
            visualizationSketch.render();
            siteSelectView.render();
        }
        return this;
    };

    app.failWithUnsupported = function () {

        return this;
    };

    return app;

});
