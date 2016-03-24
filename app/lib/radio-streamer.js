
const uid2 = require('uid2'),
      EventEmitter = require('events'),
      request = require('request'),
      plonk = require('plonk');

const debug = require('debug')('supermoon:radio-streamer');

const mimeTypes = require('app/data/mime-types');

function RadioStream (url) {
  this._running = false;
  this.id = uid2(8);
  this.url = url;
  this.type = mimeTypes.ogg;
}

RadioStream.prototype = Object.create(EventEmitter.prototype);

RadioStream.prototype.start = function () {
  var def = plonk.defer();
  if (this._running) return this;
  try {
    this.req = request(this.url)
      .on('response', (res) => {
        this._running = true;
        this.res = res;
        this.out = res;
        def.resolve(this);
        this.emit('start');
      });
  } catch (err) { def.reject(err); }
  return def.promise;
};

RadioStream.prototype.pipe = function (stream) {
  if (!stream || !this.out) throw new Error('No destination stream');
  return this.out.pipe(stream);
};

RadioStream.prototype.stop = function () {
  this._running = false;
  this.req && this.req.abort();
  this.res && this.res.destroy();
  this.emit('stop');
  return this;
};

function RadioStreamer () {
  this.streams = [];
}

RadioStreamer.prototype.subscribe = function (url, type) {
  var stream = new RadioStream(url)
    .on('start', () => { debug('[start]', stream.id, stream.url, stream.type); })
    .on('stop', () => {
      this.streams = this.streams.filter((s) => { s.id !== stream.id; });
      debug('[stop]', stream.id, stream.url, stream.type);
    });
  this.streams.push(stream);
  return stream.start();
};

module.exports = RadioStreamer;
