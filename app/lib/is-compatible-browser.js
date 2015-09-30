
var _ = { isUndefined: require('lodash/lang/isUndefined') };

var canPlay = require('app/lib/can-play');

module.exports = function () {
    return function () {
        if (_.isUndefined(audioContext) && _.isUndefined(webkitAudioContext)) return false;
        if (_.isUndefined(audioContext.createGain) || _.isUndefined(audioContext.createMediaElementSource)) return false;
        if (canPlay.ogg === false) return false;
        return true;
    };
};
