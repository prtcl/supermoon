import { div, h1 } from '@hyperapp/html';
import { fadeIn, fadeOut } from '../lib/transitions';
import './Modal.less';
import Button from './Button';

const Modal = ({
  button = null,
  class: parentClass,
  title = null,
  onClose = () => null,
  ...rest
}, children) => (
  div({
    ...rest,
    class: parentClass ? ['Modal', parentClass].join(' ') : 'Modal',
    oncreate: (element) => fadeIn(element),
    onremove: (element, done) => fadeOut(element).then(done)
  }, [
    div({ class: 'Modal__content' }, [
      title && h1({}, title),
      children,
      button && Button({
        text: button,
        onClick: onClose
      })
    ])
  ])
);

export default Modal;
