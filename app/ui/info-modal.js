
var EventEmitter = require('events');

var _ = {
    bind: require('lodash/function/bind'),
    create: require('lodash/object/create')
};

var plonk = require('plonk');

function InfoModal (args) {
    args || (args = {});
    this.el = args.el;
    this.ui = { playButton: this.el.querySelector('.play') };
    this.ui.playButton.addEventListener('click', _.bind(this._clickHandler, this));
}

InfoModal.prototype = _.create(EventEmitter.prototype, InfoModal.prototype);

InfoModal.prototype._clickHandler = function (e) {
    e.preventDefault();
    this.close();
    this.emit('play');
};

InfoModal.prototype.close = function () {
    this.el.classList.remove('fade-in');
    this.el.classList.add('fade-out');
    plonk.wait(1500, function () {
        this.el.classList.add('hidden');
    }, this);
    return this;
};

module.exports = InfoModal;
