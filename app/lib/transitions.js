import { wait } from 'plonk';
import { FADE_IN_DURATION, FADE_OUT_DURATION } from '../constants/ui';
import './transitions.less';

export const fadeIn = (element) => {
  element.classList.add('fade--entering');
  return wait(FADE_IN_DURATION)
    .then(() => {
      element.classList.add('fade--entered');
      element.classList.remove('fade--entering');
    });
};

export const fadeOut = (element) => {
  element.classList.add('fade--exiting');
  element.classList.remove('fade--entered');
  return wait(FADE_OUT_DURATION)
    .then(() => {
      element.classList.add('fade--exited');
    });
};
