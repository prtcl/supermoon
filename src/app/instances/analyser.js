
define(function (require) {

    var createAnalyser = require('nodes/create-analyser');

    var analyser = { node: createAnalyser({ size: 512 }) };
    analyser.waveData = new Uint8Array(analyser.node.frequencyBinCount);
    analyser.frequencyData = new Uint8Array(analyser.node.frequencyBinCount);
    analyser.sampleRate = analyser.node.context.sampleRate;
    analyser.frameRate = analyser.sampleRate / analyser.node.frequencyBinCount;
    analyser.update = function () {
        this.node.getByteTimeDomainData(this.waveData);
        this.node.getByteFrequencyData(this.frequencyData);
        return this;
    };
    return analyser;

});
