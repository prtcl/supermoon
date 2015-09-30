
var _ = {
    create: require('lodash/object/create'),
    isUndefined: require('lodash/lang/isUndefined')
};

var EventEmitter = require('events');

var audioContext = require('app/synth-engine/audio-context'),
    createGain = require('app/synth-engine/create-gain'),
    createCompressor = require('app/synth-engine/create-compressor'),
    createFilter = require('app/synth-engine/create-filter'),
    StreamPlayer = require('app/synth-engine/stream-player'),
    AudioAnalyser = require('app/synth-engine/audio-analyser');

function SynthEngine () {
    this.audioContext = audioContext();
    this.nodes = {};
    this._ready = false;
    this._compatibleBrowser = this.isCompatibleBrowser();
};

SynthEngine.prototype = _.create(EventEmitter.prototype, SynthEngine.prototype);

SynthEngine.prototype.isCompatibleBrowser = function () {
    if (_.isUndefined(this.audioContext)) return false;
    if (_.isUndefined(this.audioContext.createGain) || _.isUndefined(this.audioContext.createMediaElementSource)) return false;
    return true;
};

SynthEngine.prototype.run = function () {
    if (this.isReady()) return this;
    if (!this._compatibleBrowser) {
        this.emit('error', new Error('Browser is not compatible with Web Audio API.'));
        return this;
    }
    try {
        this.nodes.streamPlayer = new StreamPlayer(this.audioContext);
        this.nodes.output = createGain({ gain: 0 }, this.audioContext);
        this.nodes.eqLow = createFilter({ type: 'lowshelf', frequency: 120, q: 2, gain: 25 }, this.audioContext);
        this.nodes.eqLowMid = createFilter({ type: 'peaking', frequency: 250, q: 2.5, gain: 8 }, this.audioContext);
        this.nodes.eqHighMid = createFilter({ type: 'peaking', frequency: 2400, q: 0.5, gain: 6 }, this.audioContext);
        this.nodes.eqHigh = createFilter({ type: 'highshelf', frequency: 6400, q: 1, gain: 10 }, this.audioContext);
        this.nodes.outputCompressor = createCompressor({ ratio: 20, threshold: -35, attack: 0.1, release: 0.25 }, this.audioContext);
        this.nodes.audioAnalyser = new AudioAnalyser({ size: 512 }, this.audioContext);
        this.nodes.streamPlayer.node.connect(this.nodes.output);
        this.nodes.output.connect(this.nodes.eqLow);
        this.nodes.eqLow.connect(this.nodes.eqLowMid);
        this.nodes.eqLowMid.connect(this.nodes.eqHighMid);
        this.nodes.eqHighMid.connect(this.nodes.eqHigh);
        this.nodes.eqHigh.connect(this.nodes.outputCompressor);
        this.nodes.outputCompressor.connect(this.nodes.audioAnalyser.node);
        this.nodes.outputCompressor.connect(this.audioContext.destination);
        this._ready = true;
    } catch (err) {
        this.emit('error', err);
    }
    if (this.isReady()) this.emit('ready');
    return this;
};

SynthEngine.prototype.setStreamSource = function (streamId) {
    if (!streamId || !this.isReady()) return this;
    this.nodes.streamPlayer.setStreamSource(streamId);
    return this;
};

SynthEngine.prototype.isReady = function () {
    return (this._compatibleBrowser && this._ready && this.nodes.streamPlayer.isReady());
};

SynthEngine.prototype.play = function () {
    if (!this.isReady()) return this;
    var currentTime = this.audioContext.currentTime;
    this.nodes.output.gain.setTargetAtTime(1.5, currentTime, 10);
    return this;
};

SynthEngine.prototype.stop = function () {
    if (!this.isReady()) return this;
    var currentTime = this.audioContext.currentTime;
    this.nodes.output.gain.setTargetAtTime(0, currentTime, 0.1);
    return this;
};

module.exports = SynthEngine;
