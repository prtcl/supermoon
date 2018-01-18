import { div, h1 } from '@hyperapp/html';
import { exit } from 'hyperapp-transitions';
import './Modal.less';
import Button from './Button';
import { FADE_OUT_DURATION } from '../constants/ui';

const Modal = ({
  button = null,
  title = null,
  onClose = () => null
}, children) => (
  exit({
    time: FADE_OUT_DURATION,
    easing: 'ease-in-out',
    css: { opacity: 0 }
  }, [
    div({ class: 'Modal' }, [
      div({ class: 'Modal__content' }, [
        title && h1({}, title),
        children,
        button && Button({
          text: button,
          onClick: onClose
        })
      ])
    ])
  ])
);

export default Modal;
