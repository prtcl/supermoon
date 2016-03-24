
const uid2 = require('uid2'),
      EventEmitter = require('events'),
      request = require('request');

const mimeTypes = require('app/data/mime-types');

function OggStream (url, req, res) {
  this._running = false;
  this.id = uid2(8);
  this.url = url;
  this.type = mimeTypes.ogg;
  this.client = { req: req, res: res };
}

OggStream.prototype = Object.create(EventEmitter.prototype);

OggStream.prototype.start = function () {
  if (this._running) return this;
  this.client.req.on('close', this.stop.bind(this));
  this.req = request(this.url)
    .on('response', (res) => {
      this._running = true;
      this.res = res;
      this.client.res.status(200).type(this.type);
      this.res.pipe(this.client.res);
      this.emit('start');
    });
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

// function Mp3Stream (url, req, res) {
//     this._running = false;
//     this.id = uid2(8);
//     this.url = url;
//     this.type = mimeTypes['mp3'];
//     this.client = { req: req, res: res };
// }

// Mp3Stream.prototype = _.create(EventEmitter.prototype, Mp3Stream.prototype);

// Mp3Stream.prototype.start = function () {
//     if (this._running) return this;
//     function responseHandler (res) {
//         this._running = true;
//         this.res = res;
//         this.client.res.status(200).type(this.type);
//         this.oggDecoder = new ogg.Decoder();
//         this.res.pipe(this.oggDecoder);
//         this.oggDecoder.on('stream', function (stream) {
//             console.log(stream);
//         });
//         // this.res.pipe(this.client.res);
//         this.emit('start');
//     }
//     this.client.req.on('close', _.bind(this.stop, this));
//     this.req = request(this.url)
//         .on('response', _.bind(responseHandler, this));
//     return this;
// };

// Mp3Stream.prototype.stop = function () {
//     this._running = false;
//     this.client.res.end();
//     this.req && this.req.abort();
//     this.res && this.res.destroy();
//     this.emit('stop');
//     return this;
// };

function RadioStreamer () {
  this.streams = [];
}

RadioStreamer.prototype.subscribe = function (url, type, req, res) {
  // var RadioStream = (type === 'ogg' ? OggStream : Mp3Stream),
  var RadioStream = OggStream,
      stream = new RadioStream(url, req, res)
        .on('start', () => { console.log('[start]', stream.id, stream.url, stream.type); })
        .on('stop', () => {
          this.streams = this.streams.filter((s) => { s.id !== stream.id; });
          console.log('[stop]', stream.id, stream.url, stream.type);
        });
  this.streams.push(stream);
  stream.start();
  return stream;
};

module.exports = RadioStreamer;
