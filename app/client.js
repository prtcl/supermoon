
var app = {};

app.run = function () {

    return this;
};

window.addEventListener('load', function () {
    window.app = app.run();
});

module.exports = app;
