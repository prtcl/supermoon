
define(function (require) {

    var audioContext = require('instances/audio-context');

    return function (args) {
        args || (args = {});
        var audioElement = new Audio();
        audioElement.type = args.type || 'audio/ogg';
        audioElement.src = args.src || '';
        var node = audioContext.createMediaElementSource(audioElement);
        audioElement.play();
        return node;
    };

});
