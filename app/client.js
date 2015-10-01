
var SynthEngine = require('app/synth-engine/synth-engine'),
    VlfSiteSelect = require('app/ui/vlf-site-select'),
    Visualization = require('app/ui/visualization');

var app = {};

app.run = function () {
    this.synthEngine = new SynthEngine()
        .on('error', function (err) { console.error(err); })
        .on('ready', function () { console.log('[ready] synth engine'); })
        .run();
    this.vlfSiteSelect = new VlfSiteSelect({ el: document.body.querySelector('#vlf-site-select') })
        .on('selected', function (vlfSite) {
            app.synthEngine.setStreamSource(vlfSite.id);
            console.log(vlfSite);
        })
        .render();
    this.visualization = new Visualization({ el: document.body.querySelector('#visualization') })
        .fetchData(function () {
            return app.synthEngine.nodes.audioAnalyser.update();
        });
    return this;
};

app.play = function () {
    this.synthEngine.play();
    this.visualization.run();
    return this;
};

window.addEventListener('load', function () {
    window.app = app.run();
    app.play();
});

module.exports = app;
