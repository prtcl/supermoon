
var _ = { assign: require('lodash/object/assign') };

module.exports = function (audioContext) {
    return function (args) {
        args || (args = {});
        var options = _.assign({ gain: 0 }, args),
            gainNode = audioContext.createGain();
        gainNode.gain.value = options.gain;
        return gainNode;
    };
};
