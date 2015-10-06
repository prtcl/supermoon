
var uid2 = require('uid2'),
    EventEmitter = require('events'),
    request = require('request'),
    ogg = require('ogg'),
    lame = require('lame');

var _ = {
    bind: require('lodash/function/bind'),
    create: require('lodash/object/create'),
    each: require('lodash/collection/each'),
    filter: require('lodash/collection/filter'),
    where: require('lodash/collection/where')
};

var mimeTypes = require('app/data/mime-types');

function OggStream (url, req, res) {
    this._running = false;
    this.id = uid2(8);
    this.url = url;
    this.type = mimeTypes['ogg'];
    this.client = { req: req, res: res };
}

OggStream.prototype = _.create(EventEmitter.prototype, OggStream.prototype);

OggStream.prototype.start = function () {
    if (this._running) return this;
    function responseHandler (res) {
        this._running = true;
        this.res = res;
        this.client.res.status(200).type(this.type);
        this.res.pipe(this.client.res);
        this.emit('start');
    }
    this.client.req.on('close', _.bind(this.stop, this));
    this.req = request(this.url)
        .on('response', _.bind(responseHandler, this));
    return this;
};

OggStream.prototype.stop = function () {
    this._running = false;
    this.client.res.end();
    this.req && this.req.abort();
    this.res && this.res.destroy();
    this.emit('stop');
    return this;
};

function RadioStreamer () {
    this.streams = [];
}

RadioStreamer.prototype.subscribe = function (url, type, req, res) {
    var Stream = (type === 'ogg' ? OggStream : Mp3Stream),
        stream = new Stream(url, req, res);
    this.streams.push(stream);
    function removeStream () {
        this.streams = _.filter(this.streams, function (s) { return s.id !== stream.id; });
        console.log('[stop]', stream.id, stream.url, stream.type);
        delete stream;
    }
    stream
        .on('start', function () { console.log('[start]', stream.id, stream.url, stream.type); })
        .on('stop', _.bind(removeStream, this, stream))
        .start();
    return stream;
};

module.exports = RadioStreamer;
