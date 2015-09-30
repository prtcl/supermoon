
var _ = { create: require('lodash/object/create') };

var EventEmitter = require('events');

var audioContext = require('app/synth-engine/audio-context')(),
    isCompatibleBrowser = require('app/lib/is-compatible-browser');

var createGain = require('app/synth-engine/create-gain')(audioContext),
    createCompressor = require('app/synth-engine/create-compressor')(audioContext),
    createFilter = require('app/synth-engine/create-filter')(audioContext),
    StreamPlayer = require('app/synth-engine/stream-player')(audioContext),
    AudioAnalyser = require('app/synth-engine/audio-analyser')(audioContext);

function SynthEngine () {
    this._ready = false;
    this._compatibleBrowser = isCompatibleBrowser();
    if (!this._compatibleBrowser) {
        this.emit('error', new Error('Browser is not compatible with Web Audio API.'));
        return this;
    }
    this.context = audioContext;
    this.nodes = {};
    this.nodes.streamPlayer = new StreamPlayer({ type: 'audio/ogg' });
    this.nodes.output = createGain({ gain: 0 });
    this.nodes.eqLow = createFilter({ type: 'lowshelf', frequency: 120, q: 2, gain: 25 });
    this.nodes.eqLowMid = createFilter({ type: 'peaking', frequency: 250, q: 2.5, gain: 8 });
    this.nodes.eqHighMid = createFilter({ type: 'peaking', frequency: 2400, q: 0.5, gain: 6 });
    this.nodes.eqHigh = createFilter({ type: 'highshelf', frequency: 6400, q: 1, gain: 10 });
    this.nodes.outputCompressor = createCompressor({ ratio: 20, threshold: -35, attack: 0.1, release: 0.25 });
    this.nodes.audioAnalyser = new AudioAnalyser();
};

SynthEngine.prototype = _.create(EventEmitter.prototype, SynthEngine.prototype);

SynthEngine.prototype.connectNodes = function () {
    if (this._ready) return this;
    this.nodes.streamPlayer.node.connect(this.nodes.output);
    this.nodes.output.connect(this.nodes.eqLow);
    this.nodes.eqLow.connect(this.nodes.eqLowMid);
    this.nodes.eqLowMid.connect(this.nodes.eqHighMid);
    this.nodes.eqHighMid.connect(this.nodes.eqHigh);
    this.nodes.eqHigh.connect(this.nodes.outputCompressor);
    this.nodes.outputCompressor.connect(this.nodes.audioAnalyser.node);
    this.nodes.outputCompressor.connect(this.context.destination);
    this._ready = true;
    if (this.isReady()) this.emit('ready');
    return this;
};

SynthEngine.prototype.setStreamSource = function (streamId) {
    if (!streamId) return this;
    this.nodes.streamPlayer.setStreamSource(streamId);
    return this;
};

SynthEngine.prototype.isReady = function () {
    return (this._compatibleBrowser && this._ready && this.nodes.streamPlayer.isReady());
};

SynthEngine.prototype.play = function () {
    var currentTime = this.context.currentTime;
    this.nodes.output.gain.setTargetAtTime(1.5, currentTime, 10);
    return this;
};

SynthEngine.prototype.stop = function () {
    var currentTime = this.context.currentTime;
    this.nodes.output.gain.setTargetAtTime(0, currentTime, 0.1);
    return this;
};

module.exports = SynthEngine;
