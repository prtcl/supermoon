
define(function (require) {

    var audioContext = require('instances/audio-context');

    return function (args) {
        args || (args = {});
        var audio = new Audio();
        audio.type = args.type || 'audio/ogg';
        audio.src = args.src || '';
        var node = audioContext.createMediaElementSource(audio);
        audio.play();
        return node;
    };

});
