
var uid2 = require('uid2'),
    EventEmitter = require('events'),
    request = require('request');

var _ = {
    bind: require('lodash/function/bind'),
    create: require('lodash/object/create'),
    each: require('lodash/collection/each'),
    filter: require('lodash/collection/filter')
};

function Stream (url) {
    this._running = false;
    this.url = url;
    this.clients = [];
}

Stream.prototype = _.create(EventEmitter.prototype, Stream.prototype);

Stream.prototype.start = function () {
    if (this._running) return this;
    this.stream = request(this.url)
        .on('response', _.bind(function (res) {
            console.log(res.headers);
            this._running = true;
            this.on('stop', function () { res.destroy(); });
            res.on('data', _.bind(this.chunkHandler, this));
        }, this));
    return this;
};

Stream.prototype.stop = function () {
    this._running = false;
    this.stream.abort();
    this.emit('stop');
    console.log('[stopped] ' + this.url);
    return this;
};

Stream.prototype.chunkHandler = function (chunk) {
    _.each(this.clients, function (client) {
        client.res.write(chunk);
        console.log('[chunk] ' + client.id + ' ' + Date.now());
    }, this);
    this.emit('chunk', chunk);
};

Stream.prototype.addClient = function (req, res) {
    if (!this._running) this.start();
    var id = uid2(8);
    this.clients.push({ id: id, req: req, res: res });
    var removeClient = _.bind(this.removeClient, this, id);
    res.type('audio/ogg');
    req.on('end', removeClient);
    req.on('close', removeClient);
    return this;
};

Stream.prototype.removeClient = function (id) {
    this.clients = _.filter(this.clients, function (c) { return c.id !== id; });
    if (!this.clients.length) this.stop();
    return this;
};

function RadioStreamer () {
    this.streams = {};
}

RadioStreamer.prototype.subscribe = function (url, req, res) {
    var stream = this.streams[url] || new Stream(url);
    stream.addClient(req, res);
    return stream;
};

module.exports = RadioStreamer;
