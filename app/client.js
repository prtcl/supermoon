
var VlfSiteSelect = require('app/ui/vlf-site-select');

var app = {};

app.run = function () {
    this.vlfSiteSelect = new VlfSiteSelect({ el: document.body.querySelector('#vlf-site-select') })
        .on('selected', function (id) { console.log(id); })
        .render();
    return this;
};

window.addEventListener('load', function () {
    window.app = app.run();
});

module.exports = app;
