
define(function (require) {

    var audioContext = require('instances/audio-context'),
        audioAnalyser = require('instances/analyser'),
        isCompatibleBrowser = require('utils/is-compatible-browser');

    var createGain = require('nodes/create-gain'),
        createCompressor = require('nodes/create-compressor'),
        createFilter = require('nodes/create-filter'),
        createAudioElement = require('nodes/create-audio-element');;

    var synthEngine = { _ready: false, nodes: {} };

    if (!isCompatibleBrowser()) return synthEngine;

    synthEngine.nodes.streamPlayer = {};
    synthEngine.nodes.output = createGain({ gain: 0 });
    synthEngine.nodes.eqLow = createFilter({ type: 'lowshelf', frequency: 120, q: 2, gain: 25 });
    synthEngine.nodes.eqLowMid = createFilter({ type: 'peaking', frequency: 250, q: 2.5, gain: 8 });
    synthEngine.nodes.eqHighMid = createFilter({ type: 'peaking', frequency: 2400, q: 0.5, gain: 6 });
    synthEngine.nodes.eqHigh = createFilter({ type: 'highshelf', frequency: 6400, q: 1, gain: 10 });
    synthEngine.nodes.outputCompressor = createCompressor({ ratio: 20, threshold: -35, attack: 0.1, release: 0.25 });

    synthEngine.connectNodes = function () {
        if (this._ready) return this;
        this.nodes.streamPlayer = createAudioElement({ type: 'audio/ogg' });
        this.nodes.streamPlayer.connect(this.nodes.output);
        this.nodes.output.connect(this.nodes.eqLow);
        this.nodes.eqLow.connect(this.nodes.eqLowMid);
        this.nodes.eqLowMid.connect(this.nodes.eqHighMid);
        this.nodes.eqHighMid.connect(this.nodes.eqHigh);
        this.nodes.eqHigh.connect(this.nodes.outputCompressor);
        this.nodes.outputCompressor.connect(audioAnalyser.node);
        this.nodes.outputCompressor.connect(audioContext.destination);
        this._ready = true;
        return this;
    };

    synthEngine.setStreamSource = function (sourceUrl) {
        if (!sourceUrl) return this;
        var mediaElement = this.nodes.streamPlayer.mediaElement;
        mediaElement.src = sourceUrl;
        mediaElement.play();
        return this;
    };

    synthEngine.isReady = function () { return (this._ready && 'mediaElement' in this.nodes.streamPlayer); };

    synthEngine.play = function () {
        var currentTime = audioContext.currentTime;
        this.nodes.output.gain.setTargetAtTime(1.5, currentTime, 10);
        return this;
    };

    synthEngine.stop = function () {
        var currentTime = audioContext.currentTime;
        this.nodes.output.gain.setTargetAtTime(0, currentTime, 0.1);
        return this;
    };

    return synthEngine;

});
