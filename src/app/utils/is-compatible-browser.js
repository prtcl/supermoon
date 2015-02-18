
define(function (require) {

    var audioContext = require('instances/audio-context'),
        canPlay = require('utils/can-play');

    return function () {
        if (typeof audioContext === 'undefined') return false;
        if (_.isUndefined(audioContext.createGain) || _.isUndefined(audioContext.createMediaElementSource)) return false;
        if (canPlay.ogg === false) return false;
        return true;
    };

});
