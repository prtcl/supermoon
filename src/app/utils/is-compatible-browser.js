
define(function (require) {

    var audioContext = require('instances/audio-context'),
        canPlay = require('utils/can-play');

    return function () {
        if (typeof audioContext === 'undefined') return false;
        if (canPlay.ogg === false && canPlay.mp3 === false) return false;
        if (!('createGain' in audioContext)) return false;
        return true;
    };

});
