
var _ = { assign: require('lodash/object/assign') };

module.exports = function (audioContext) {

    function AudioAnalyser (args) {
        args || (args = {});
        var options = _.assign({ size: 512, max: 0, min: -100 }, args);
        this.node = audioContext.createAnalyser();
        this.node.fftSize = options.size;
        this.node.maxDecibels = options.max;
        this.node.minDecidels = options.min;
        this.waveData = new Uint8Array(this.node.frequencyBinCount);
        this.frequencyData = new Uint8Array(this.node.frequencyBinCount);
        this.sampleRate = this.node.context.sampleRate;
        this.frameRate = this.sampleRate / this.node.frequencyBinCount;
    }

    AudioAnalyser.prototype.update = function () {
        this.node.getByteTimeDomainData(this.waveData);
        this.node.getByteFrequencyData(this.frequencyData);
        return this;
    };

    return AudioAnalyser;

};
