import * as helpers from './helpers';
import bindHelpers from '../lib/bindHelpers';
import { canPlayType, MimeTypes } from './StreamPlayer';

export const AudioContext = [
  window.AudioContext,
  window.webkitAudioContext
].find((c) => typeof c !== 'undefined');

export const isCompatibleBrowser = () => {
  if (canPlayType() !== MimeTypes.OGG) {
    return false;
  }
  if (!AudioContext ||
      typeof AudioContext.prototype.createGain !== 'function' ||
      typeof AudioContext.prototype.createMediaElementSource !== 'function'
    ) {
    return false;
  }
  return true;
};

export const create = () => {
  const context = new AudioContext();
  const {
    createAnalyser,
    createCompressor,
    createFilter,
    createGain,
    createStreamPlayer
  } = bindHelpers(context)(helpers);
  const analyser = createAnalyser({ size: 512 });
  const streamPlayer = createStreamPlayer();
  const nodes = {
    analyser: analyser.node,
    eqHigh: createFilter({ type: 'highshelf', frequency: 6400, q: 1, gain: 10 }),
    eqHighMid: createFilter({ type: 'peaking', frequency: 2400, q: 0.5, gain: 6 }),
    eqLow: createFilter({ type: 'lowshelf', frequency: 120, q: 2, gain: 25 }),
    eqLowMid: createFilter({ type: 'peaking', frequency: 250, q: 2.5, gain: 8 }),
    output: createGain({ gain: 0 }),
    outputCompressor: createCompressor({ ratio: 20, threshold: -35, attack: 0.1, release: 0.25 }),
    streamPlayer: streamPlayer.node
  };

  nodes.streamPlayer.connect(nodes.output);
  nodes.output.connect(nodes.eqLow);
  nodes.eqLow.connect(nodes.eqLowMid);
  nodes.eqLowMid.connect(nodes.eqHighMid);
  nodes.eqHighMid.connect(nodes.eqHigh);
  nodes.eqHigh.connect(nodes.outputCompressor);
  nodes.outputCompressor.connect(nodes.analyser);
  nodes.outputCompressor.connect(context.destination);

  return {
    setStreamSource (...args) {
      return streamPlayer.setStreamSource(...args);
    },
    getWaveData () {
      return analyser.getWaveData();
    },
    getFrequencyData () {
      return analyser.getFrequencyData();
    },
    setVolume (val, time = 1) {
      const { currentTime } = context;
      nodes.output.gain.setTargetAtTime(val, currentTime, time);
    },
    play () {
      this.setVolume(2, 10);
    },
    stop () {
      this.setVolume(0, 0.1);
    }
  };
};
