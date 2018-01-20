
export const MimeTypes = {
  OGG: 'audio/ogg',
  MP3: 'audio/mpeg'
};

export const canPlayType = () => {
  const audio = new Audio();
  if (audio.canPlayType(`${MimeTypes.OGG}; codecs="vorbis"`) === 'probably') {
    return MimeTypes.OGG;
  }
  if (audio.canPlayType(`${MimeTypes.MP3};`) === 'probably' ||
      audio.canPlayType(`${MimeTypes.MP3};`) === 'maybe') {
    return MimeTypes.MP3;
  }
};

export default class StreamPlayer {
  constructor (context) {
    this.type = canPlayType();
    this.audio = new Audio();
    this.audio.type = this.type;
    this.node = context.createMediaElementSource(this.audio);
    this.url = '';

    window.a = this;
  }

  setStreamSource (url) {
    this.stop();
    this.url = url;
    this.audio.src = `${url}?type=${this.type}`;
    return this.play();
  }

  play () {
    return this.audio.play();
  }

  stop () {
    return this.audio.pause();
  }
}
