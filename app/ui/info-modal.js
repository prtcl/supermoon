
const EventEmitter = require('events');

const plonk = { wait: require('plonk/lib/timers/wait') };

function InfoModal (el, args = {}) {
  this.el = el;
  this.ui = { playButton: this.el.querySelector('.play') };
  this.ui.playButton.addEventListener('click', this._clickHandler.bind(this));
}

InfoModal.prototype = Object.create(EventEmitter.prototype);

InfoModal.prototype._clickHandler = function (e) {
  e.preventDefault();
  this.close();
  this.emit('play');
};

InfoModal.prototype.close = function () {
  this.el.classList.remove('fade-in');
  this.el.classList.add('fade-out');
  plonk.wait(1500)
    .then(() => {
      this.el.classList.add('hidden');
    });
  return this;
};

module.exports = InfoModal;
