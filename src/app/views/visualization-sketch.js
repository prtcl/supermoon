
define(function (require) {

    var audioAnalyser = require('instances/analyser');

    var visualizationSketch = new Processing.Sketch(function (ps){

        var drunkX = plonk.drunk(-1, 1, 0.01),
            drunkY = plonk.drunk(-1, 1, 0.01),
            drunkR = plonk.drunk(-1, 1, 0.01),
            drunkW = plonk.drunk(-1, 1, 0.01),
            drunkH = plonk.drunk(-1, 1, 0.01);

        ps.setup = function () {
            ps.frameRate(60);
            ps.background(4, 3, 3);
        };

        ps.draw = function () {
            audioAnalyser.update();
            var waveData = audioAnalyser.waveData,
                frequencyData = audioAnalyser.frequencyData;
            var centerX = ps.width / 2,
                centerY = ps.height / 2,
                radius = ps.width + (ps.width / 2);
            var n, c, o, x, y, r, w, h;
            for (var i = 5; i < 74; i++) {
                n = frequencyData[i];
                a = plonk.constrain(plonk.scale(waveData[i], 50, 200, 0, 1), 0, 1);
                if (n < 40) {
                    c = 3;
                } else {
                    c = plonk.constrain(plonk.scale(n, 33, 165, 255, 0), 0, 255);
                }
                if (c > 200) {
                    o = 238;
                } else {
                    o = plonk.log(plonk.scale(i, 0, 73, 0.18, 0.75)) * 255;
                }
                x = centerX + (drunkX() * (centerX / 10));
                y = centerY + (drunkY() * (centerY / 10));
                r = (radius / (i - 5)) + (drunkR() * 30) + (a * 50);
                w = r + ((drunkW() * r) * a);
                h = r + ((drunkH() * r) * a);
                ps.fill(c, c + 1, c + 2, o);
                ps.strokeWeight(a * 4);
                ps.stroke(c, (o / 2));
                ps.ellipse(x, y, w, h);
            }
        };

    });

    visualizationSketch.options.pauseOnBlur = true;

    return Backbone.View.extend({
        tagName: 'canvas',
        className: 'visualization',
        initialize: function () {
            _.bindAll(this, 'resizeVisualization');
            $(window).on('resize', plonk.limit(100, this.resizeVisualization, this));
        },
        render: function () {
            this.processingSketch = new Processing(this.el, visualizationSketch);
            this.resizeVisualization();
            return this;
        },
        resizeVisualization: function () {
            var w = this.$el.width(), h = this.$el.height();
            this.processingSketch.size(w, h);
            return this;
        }
    });

});
