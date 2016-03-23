
var SynthEngine = require('app/synth-engine/synth-engine'),
    VlfSiteSelect = require('app/ui/vlf-site-select'),
    Visualization = require('app/ui/visualization'),
    InfoModal = require('app/ui/info-modal'),
    ErrorModal = require('app/ui/error-modal');

var app = {}, _isRunning = false;

app.run = function () {
  if (_isRunning) return this;
  this.synthEngine = new SynthEngine()
    .on('error', function (err) { console.error(err); })
    .on('ready', function () { console.log('[ready] synth engine'); })
    .run();
  this.vlfSiteSelect = new VlfSiteSelect(document.body.querySelector('#vlf-site-select'))
    .on('selected', function (vlfSite) {
      app.synthEngine.setStreamSource(vlfSite.id);
    });
  this.visualization = new Visualization(document.body.querySelector('#visualization'))
    .fetchData(function () {
      return app.synthEngine.nodes.audioAnalyser.update();
    });
  this.infoModal = new InfoModal(document.body.querySelector('#info-modal'))
    .on('play', function () {
      app.play();
    });
  this.errorModal = new ErrorModal(document.body.querySelector('#error-modal'));
  _isRunning = true;
  return this;
};

app.play = function () {
  var streamPlayer = this.synthEngine.nodes.streamPlayer
    .on('error', function () {
      app.errorModal.show('Audio stream error.');
    })
    .on('playing', function () {
      app.errorModal.close();
    })
    .on('waiting', function () {
      app.errorModal.show('Audio stream is loading...');
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
