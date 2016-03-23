
var url = require('url'),
    EventEmitter = require('events');

var mimeTypes = require('app/data/mime-types');

function canPlayType (el) {
  el || (el = new Audio());
  var canPlay = { ogg: false, mp3: false };
  if (typeof el === 'undefined' || !el.canPlayType) return canPlay;
  canPlay.ogg = !!(el.canPlayType('audio/ogg; codecs="vorbis"') === 'probably');
  canPlay.mp3 = !!(el.canPlayType('audio/mpeg;') === 'probably' || el.canPlayType('audio/mpeg;') === 'maybe');
  return canPlay;
};

function StreamPlayer (audioContext) {
  this.el = new Audio();
  this._canPlay = canPlayType(this.el);
  if (this._canPlay.ogg) {
    this.type = 'ogg';
  } else if (this._canPlay.mp3) {
    this.type = 'mp3';
  } else {
    this.type = 'unsupported';
  }
  this.el.type = mimeTypes[this.type];
  this.node = audioContext.createMediaElementSource(this.el);
  this.baseUrl = '/stream';
  ['canplay', 'abort', 'error', 'loadeddata', 'playing', 'progress', 'suspend', 'waiting'].forEach(function (ev) {
    this.el.addEventListener(ev, function (e) {
      this.emit(ev, e);
    }.bind(this));
  }.bind(this));
  if (this.id) this.setStreamSource(this.id);
}

StreamPlayer.prototype = Object.create(EventEmitter.prototype);

StreamPlayer.prototype.setStreamSource = function (id) {
  if (!id || !this.isReady()) return this;
  this.stop();
  this.id = id || this.id;
  this.el.src = url.format({
    pathname: this.baseUrl,
    query: { id: this.id, type: this.type }
  });
  this.play();
  return this;
};

StreamPlayer.prototype.isReady = function () {
  return (typeof this.el !== 'undefined' && typeof this.node !== 'undefined' && this.type !== 'unsupported');
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

module.exports = StreamPlayer;
