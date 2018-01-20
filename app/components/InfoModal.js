import { p, a } from '@hyperapp/html';
import Modal from './Modal';

const InfoModal = (props) => (
  Modal({
    ...props,
    class: 'InfoModal',
    button: 'Play',
    title: 'Supermoon'
  }, [
    p({}, 'Supermoon is an audio-reactive visualization of real-time natural (very low frequency) radio streams. The visualization is tuned to emphasize the unique phenomena of VLF radio like solar activity, lightning strikes, and man-made interference.'),
    p({}, 'A recent version of Chrome/Firefox and decent quality speakers/headphones are required to view the work.'),
    p({}, [
      'Supermoon was created by ',
      a({ href: 'http://prtcl.cc' }, 'Cory O\'Brien'), '. ',
      'Code is available on ',
      a({ href: 'https://github.com/prtcl/supermoon' }, 'Github'), '. ',
      'Radio streams are provided by ',
      a({ href: 'http://abelian.org/vlf/' }, 'abelian.org'), '.'
    ])
  ])
);

export default InfoModal;
