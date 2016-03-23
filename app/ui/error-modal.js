
var plonk = { wait: require('plonk/lib/timers/wait') };

function ErrorModal (el, args) {
  args || (args = {});
  this.el = el;
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
  plonk.wait(1500)
    .then(function () {
      if (this.visible) return;
      this.el.classList.add('hidden');
    }.bind(this));
  return this;
};

module.exports = ErrorModal;
