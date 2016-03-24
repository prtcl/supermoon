
const _ = { assign: require('lodash/object/assign') };

module.exports = function (args, audioContext) {
  var options = _.assign({ gain: 0 }, args),
      gainNode = audioContext.createGain();
  gainNode.gain.value = options.gain;
  return gainNode;
};
