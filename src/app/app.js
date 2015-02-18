
define(function (require) {

    var app = require('instances/app'),
        synthEngine = require('instances/synth-engine');

    var isCompatibleBrowser = require('utils/is-compatible-browser');

    var VisualizationSketch = require('views/visualization-sketch'),
        FloatingSiteSelectView = require('views/floating-vlf-site-select'),
        FailWithUnsupportedModal = require('views/fail-with-unsupported-modal');

    app.ui = {
        visualizationContainer: '#visualization-container',
        controlsContainer: '#controls-container',
        modalContainer: '#modal-container'
    };

    app.inits.add(function () {
        this.synthEngine = synthEngine;
        this.play();
    });

    app.play = function () {
        if (!isCompatibleBrowser()) return this.failWithUnsupported();
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
        } else {
            this.failWithUnsupported();
        }
        return this;
    };

    app.failWithUnsupported = function () {
        var failWithUnsupportedModal = new FailWithUnsupportedModal();
        this.ui.modalContainer.empty()
            .append(failWithUnsupportedModal.el);
        failWithUnsupportedModal.render();
        return this;
    };

    return app;

});
