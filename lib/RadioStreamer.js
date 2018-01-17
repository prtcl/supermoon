const uid2 = require('uid2');
const EventEmitter = require('events');
const request = require('request');
const debug = require('debug')('supermoon:radio-streamer');

const MimeTypes = {
 ogg: 'audio/ogg',
 mp3: 'audio/mpeg'
};

class RadioStream extends EventEmitter {
  constructor (url) {
    super();
    this.isRunning = false;
    this.id = uid2(8);
    this.url = url;
    this.type = MimeTypes.ogg;
  }

  start () {
    return new Promise((resolve, reject) => {
      this.req = request.get(this.url)
        .on('response', (res) => {
          this.isRunning = true;
          this.res = res;
          this.out = res;
          this.emit('start');
          resolve(this);
        })
        .on('error', (err) => {
          this.emit('error', err);
          reject(err);
        });
    });
  }

  stop () {
    this.isRunning = false;
    this.req && this.req.abort();
    this.res && this.res.destroy();
    this.emit('stop');
  }

  pipe (stream) {
    if (!stream || !this.out) {
      throw new Error('No destination stream');
    }
    return this.out.pipe(stream);
  }
}

module.exports = {
  streams: [],
  subscribe (url) {
    const stream = new RadioStream(url)
      .on('start', () => {
        debug('[start]', stream.id, stream.url, stream.type);
      })
      .on('stop', () => {
        this.streams = this.streams.filter((s) => s.id !== stream.id);
        debug('[stop]', stream.id, stream.url, stream.type);
      })
      .on('error', (err) => {
        debug('[fail]', stream.id, err);
      });
    this.streams.push(stream);
    return stream.start();
  }
};
