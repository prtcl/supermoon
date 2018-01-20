import AudioAnalyser from './AudioAnalyser';
import StreamPlayer from './StreamPlayer';

export const createAnalyser = (context) => (...args) => (
  new AudioAnalyser(context, ...args)
);

export const createCompressor = (
  context
) => ({
  ratio = 1.5,
  threshold = -1,
  attack = 0.1,
  release = 0.25
}) => {
  const node = context.createDynamicsCompressor();
  node.threshold.value = threshold;
  node.ratio.value = ratio;
  node.attack.value = attack;
  node.release.value = release;
  return node;
};

export const createFilter = (
  context
) => ({
  type = 'lowpass',
  frequency = 1000,
  q = 0.0001,
  gain = 0
}) => {
  const node = context.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  node.gain.value = gain;
  return node;
};

export const createGain = (
  context
) => ({
  gain = 0
}) => {
  const node = context.createGain();
  node.gain.value = gain;
  return node;
};

export const createStreamPlayer = (context) => (...args) => (
  new StreamPlayer(context, ...args)
);
