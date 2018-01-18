import { h } from 'hyperapp';

const InfoModal = ({ onClose }) => (
  h('div', {}, [
    h('h1', {}, 'Supermoon'),
    h('p', {}, 'Supermoon is an audio-reactive visualization of real-time natural (very low frequency) radio streams. The visualization is tuned to emphasize the unique phenomena of VLF radio like solar activity, lightning strikes, and man-made interference.'),
    h('p', {}, 'A recent version of Chrome/Firefox and decent quality speakers/headphones are required to view the work.'),
    h('p', {}, [
      'Supermoon was created by ',
      h('a', { href: 'http://prtcl.cc' }, 'Cory O\'Brien'), '. ',
      'Code is available on ',
      h('a', { href: 'https://github.com/prtcl/supermoon' }, 'Github'), '. ',
      'Radio streams are provided by ',
      h('a', { href: 'http://abelian.org/vlf/' }, 'abelian.org'), '.'
    ]),
    h('button', { onclick: onClose }, 'Play')
  ])
);

export default InfoModal;
