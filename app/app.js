
const SynthEngine = require('app/synth-engine/synth-engine'),
      VlfSiteSelect = require('app/ui/vlf-site-select'),
      Visualization = require('app/ui/visualization'),
      InfoModal = require('app/ui/info-modal'),
      ErrorModal = require('app/ui/error-modal');

const app = {};
var _isRunning = false;

app.run = function () {
  if (_isRunning) return this;
  this.synthEngine = new SynthEngine()
    .on('error', (err) => { console.error(err); })
    .on('ready', () => { console.log('[ready] synth engine'); })
    .run();
  this.vlfSiteSelect = new VlfSiteSelect(document.body.querySelector('#vlf-site-select'))
    .on('selected', (vlfSite) => {
      this.synthEngine.setStreamSource(vlfSite.id);
    });
  this.visualization = new Visualization(document.body.querySelector('#visualization'))
    .fetchData(() => {
      return this.synthEngine.nodes.audioAnalyser.update();
    });
  this.infoModal = new InfoModal(document.body.querySelector('#info-modal'))
    .on('play', () => {
      this.play();
    });
  this.errorModal = new ErrorModal(document.body.querySelector('#error-modal'));
  _isRunning = true;
  return this;
};

app.play = function () {
  var streamPlayer = this.synthEngine.nodes.streamPlayer
    .on('error', () => {
      this.errorModal.show('Audio stream error.');
    })
    .on('playing', () => {
      this.errorModal.close();
    })
    .on('waiting', () => {
      this.errorModal.show('Audio stream is loading...');
    });
  if (streamPlayer.type !== 'ogg') {
    app.errorModal.show("It doesn't look like your browser supports ogg/vorbis audio playback. Please use a recent version of Chrome or Firefox.");
  } else {
    this.vlfSiteSelect.render();
    this.synthEngine.play();
    this.visualization.run();
  }
  return this;
};

module.exports = app;
