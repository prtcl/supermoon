
var _ = {
    bind: require('lodash/function/bind'),
    each: require('lodash/collection/each')
};

var plonk = require('plonk');

function golden (n) {
    return plonk.constrain(Math.pow(n, 1.61803398875), 0, 1);
}

function Visualization (args) {
    args || (args = {});
    this.el = args.el;
    this.ui = { canvas: this.el.querySelector('canvas') };
    this.context = this.ui.canvas.getContext('2d');
    this.frameRate = args.frameRate || 60;
    this._frameRateInterval = 1000 / this.frameRate;
    this.drunkX = plonk.drunk(-1, 1, 0.01),
    this.drunkY = plonk.drunk(-1, 1, 0.01),
    this.drunkR = plonk.drunk(-1, 1, 0.01),
    this.drunkW = plonk.drunk(-1, 1, 0.01),
    this.drunkH = plonk.drunk(-1, 1, 0.01);
    this.resize();
    window.addEventListener('resize', plonk.limit(100, this.resize, this));
}

Visualization.prototype.resize = function () {
    this.ui.canvas.width = this.width = this.ui.canvas.clientWidth;
    this.ui.canvas.height = this.height = this.ui.canvas.clientHeight;
};

Visualization.prototype.fetchData = function (accessor) {
    if (typeof accessor === 'function') {
        this._fetchDataAccessor = accessor;
        return this;
    } else if (this._fetchDataAccessor) {
        return this._fetchDataAccessor();
    }
    return undefined;
};

Visualization.prototype._drawFrame = function (time, start, i) {
    if (Math.abs(time - this._time) < this._frameRateInterval) return;
    this._time = time;
    var data = this.fetchData();
    if (!data) return;
    var centerX = this.width / 2, centerY = this.height / 2, radius = this.width + (this.width / 2),
        n, o, c, a, x, y, r, w, h;
    for (var i = 5; i < 74; i++) {
        n = data.frequencyData[i];
        o = golden(plonk.scale(data.waveData[i], 50, 200, 0, 1), 0, 1);
        if (n < 40) {
            c = 3;
        } else {
            c = plonk.constrain(plonk.scale(n, 33, 165, 245, 10), 10, 245);
        }
        if (c > 200) {
            a = 0.93;
        } else {
            a = golden(plonk.scale(i, 0, 73, 0.18, 0.75));
        }
        x = centerX + (this.drunkX() * (centerX / 10));
        y = centerY + (this.drunkY() * (centerY / 10));
        r = (radius / (i - 5)) + (this.drunkR() * 30) + (o * 50);
        w = r + ((this.drunkW() * r) * o);
        h = r + ((this.drunkH() * r) * o);
        this.alpha(a);
        this.fill(
            Math.round(c + plonk.rand(-1, 1)),
            Math.round(c + plonk.rand(-3, 3)),
            Math.round(c + plonk.rand(-10, 10)),
            Math.round(a * 255)
            );
        this.strokeWeight(o * 4);
        this.stroke(
            Math.round(c + plonk.rand(-1, 1)),
            Math.round(c + plonk.rand(-3, 3)),
            Math.round(c + plonk.rand(-10, 10)),
            Math.round((a * 255) / 2)
            );
        this.drawEllipse(x, y, w, h);
    }
};

Visualization.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
    return this;
};

Visualization.prototype.color = function (r, g, b, a) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

Visualization.prototype.alpha = function (a) {
    this.context.globalAlpha = a;
    return this;
};

Visualization.prototype.fill = function (r, g, b, a) {
    this.context.fillStyle = this.color(r, g, b, a);
    return this;
};

Visualization.prototype.strokeWeight = function (w) {
    this.context.lineWidth = Math.max(w, 0.0001);
    return this;
};

Visualization.prototype.stroke = function (r, g, b, a) {
    this.context.strokeStyle = this.color(r, g, b, a);
    return this;
};

Visualization.prototype.drawEllipse = function (x, y, w, h) {
    x = x - w * 0.5;
    y = y - h * 0.5;
    var kappa = 0.5522847498,
        ox = (w / 2) * kappa,
        oy = (h / 2) * kappa,
        xe = x + w,
        ye = y + h,
        xm = x + w / 2,
        ym = y + h / 2;
    this.context.beginPath();
    this.context.moveTo(x, ym);
    this.context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    this.context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    this.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    this.context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
    return this;
};

Visualization.prototype.run = function () {
    this._time = plonk.now();
    plonk.frames(this._drawFrame, this);
    plonk.dust(13000, 22000, this.clear, this);
    return this;
};

module.exports = Visualization;
