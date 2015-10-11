
var EventEmitter = require('events');

var plonk = require('plonk');

function ErrorModal (args) {
    args || (args = {});
    this.el = args.el;
    this.ui = { message: this.el.querySelector('.message') };
    this.message = args.message || '';
}

ErrorModal.prototype.show = function (message) {
    this.visible = true;
    this.message = message;
    this.ui.message.innerHTML = this.message;
    this.el.classList.remove('hidden');
    this.el.classList.remove('fade-out');
    this.el.classList.add('fade-in');
    return this;
};

ErrorModal.prototype.close = function () {
    this.visible = false;
    this.el.classList.remove('fade-in');
    this.el.classList.add('fade-out');
    plonk.wait(1500, function () {
        if (this.visible) return;
        this.el.classList.add('hidden');
    }, this);
    return this;
};

module.exports = ErrorModal;
