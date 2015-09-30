
var url = require('url');

module.exports = function (audioContext) {

    function StreamPlayer (args) {
        args || (args = {});
        this.el = new Audio();
        this.el.type = this.type = args.type || 'audio/ogg';
        this.node = audioContext.createMediaElementSource(this.el);
        this.baseUrl = '/stream';
    }

    StreamPlayer.prototype.setStreamSource = function (id, type) {
        if (!id) return this;
        this.stop();
        this.el.type = type || this.el.type;
        this.el.src = url.format({
            pathname: this.baseUrl,
            query: { id: id, type: type }
        });
        this.play();
        return this;
    };

    StreamPlayer.prototype.isReady = function () {
        return (typeof this.el !== 'undefined' && typeof this.node !== 'undefined' && this.el.src);
    };

    StreamPlayer.prototype.play = function () {
        if (!this.isReady()) return this;
        this.el.play();
        return this;
    };

    StreamPlayer.prototype.stop = function () {
        if (!this.isReady()) return this;
        this.el.pause();
        return this;
    };

    return StreamPlayer;

};
