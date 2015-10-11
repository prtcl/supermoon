
var SynthEngine = require('app/synth-engine/synth-engine'),
    VlfSiteSelect = require('app/ui/vlf-site-select'),
    Visualization = require('app/ui/visualization'),
    InfoModal = require('app/ui/info-modal'),
    ErrorModal = require('app/ui/error-modal');

var app = {};

app.run = function () {
    this.synthEngine = new SynthEngine()
        .on('error', function (err) { console.error(err); })
        .on('ready', function () { console.log('[ready] synth engine'); })
        .run();
    this.vlfSiteSelect = new VlfSiteSelect({ el: document.body.querySelector('#vlf-site-select') })
        .on('selected', function (vlfSite) {
            app.synthEngine.setStreamSource(vlfSite.id);
        });
    this.visualization = new Visualization({ el: document.body.querySelector('#visualization') })
        .fetchData(function () {
            return app.synthEngine.nodes.audioAnalyser.update();
        });
    this.infoModal = new InfoModal({ el: document.body.querySelector('#info-modal') })
        .on('play', function () {
            app.play();
        });
    this.errorModal = new ErrorModal({ el: document.body.querySelector('#error-modal') });
    return this;
};

app.play = function () {
    var streamPlayer = this.synthEngine.nodes.streamPlayer;
    streamPlayer
        .on('error', function () {
            app.errorModal.show('Audio stream error.');
        })
        .on('playing', function () {
            app.errorModal.close();
        })
        .on('waiting', function () {
            app.errorModal.show('Audio stream is loading...');
        });
    if (streamPlayer.type === 'mp3' || streamPlayer.type === 'unsupported') {
        app.errorModal.show("MP3 streaming isn't supported at this time. Please use a recent version of Chrome or Firefox.");
    } else {
        this.vlfSiteSelect.render();
        this.synthEngine.play();
        this.visualization.run();
    }
    return this;
};

window.addEventListener('load', function () {
    window.app = app.run();
});

module.exports = app;
