import { canvas, section } from '@hyperapp/html';
import { debounce } from 'lodash-es';
import { clamp, drunk, dust, frames, rand, scale } from 'plonk';
import * as helpers from '../lib/canvas';
import bindHelpers from '../lib/bindHelpers';
import './Visualization.less';
import SiteSelect from '../components/SiteSelect';
import Copyright from '../components/Copyright';

const runVisualization = (canvas, synth) => {
  const context = canvas.getContext('2d');
  const drunkX = drunk(-1, 1, 0.01);
  const drunkY = drunk(-1, 1, 0.01);
  const drunkR = drunk(-1, 1, 0.01);
  const drunkW = drunk(-1, 1, 0.01);
  const drunkH = drunk(-1, 1, 0.01);
  const golden = (n) => clamp(Math.pow(n, 1.61803398875), 0, 1);

  const {
    alpha,
    clear,
    drawEllipse,
    fill,
    stroke,
    strokeWeight
  } = bindHelpers(context)(helpers);

  let width = 0;
  let height = 0;
  const resize = () => {
    canvas.width = width = canvas.clientWidth;
    canvas.height = height = canvas.clientHeight;
  };
  resize();
  window.addEventListener('resize', debounce(resize, 150));

  frames(() => {
    const waveData = synth.getWaveData();
    const frequencyData = synth.getFrequencyData();
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width + (width / 2);
    const startIndex = 2;
    const endIndex = Math.round(frequencyData.length / 2);

    let i = startIndex;
    while (i++ <= endIndex) {
      const n = frequencyData[i];
      const o = golden(scale(waveData[i], 50, 200, 0, 1), 0, 1);
      const c = n < 40 ?
        clamp(scale(n, 0, 40, 30, 88), 30, 88) :
        clamp(scale(n, 40, 165, 245, 10), 10, 245);
      const a = golden(scale(i, startIndex, endIndex, 0.18, 0.75));
      const x = centerX + (drunkX() * (centerX / 10));
      const y = centerY + (drunkY() * (centerY / 10));
      const r = (radius / (i - 5)) + (drunkR() * 30) + (o * 50);
      const w = r + ((drunkW() * r) * o);
      const h = r + ((drunkH() * r) * o);

      alpha(a);
      fill(
        Math.round(c + rand(-1, 1)),
        Math.round(c + rand(-3, 3)),
        Math.round(c + rand(-15, 15)),
        Math.round(a * 255)
        );
      strokeWeight(o * 4);
      stroke(
        Math.round(c + rand(-1, 1)),
        Math.round(c + rand(-3, 3)),
        Math.round(c + rand(-10, 10)),
        Math.round((a * 255) / 2)
        );
      drawEllipse(x, y, w, h);
    }
  });

  dust(13000, 22000, clear);
};

const Visualization = ({
  sites,
  synth,
  onSelectSite
}) => (
  section({ class: 'Visualization' }, [
    canvas({
      oncreate: (element) => runVisualization(element, synth)
    }),
    SiteSelect({
      sites,
      onSelectSite
    }),
    Copyright()
  ])
);

export default Visualization;
