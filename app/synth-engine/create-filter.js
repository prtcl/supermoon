
var _ = { assign: require('lodash/object/assign') };

module.exports = function (audioContext) {
    return function (args) {
        args || (args = {});
        var options = _.assign({ type: 'lowpass', frequency: 1000, q: 0.0001, gain: 0 }, args),
            filter = audioContext.createBiquadFilter();
        filter.type = options.type;
        filter.frequency.value = options.frequency;
        filter.Q.value = options.q;
        filter.gain.value = options.gain;
        return filter;
    };
};
