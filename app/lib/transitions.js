import { wait } from 'plonk';
import './transitions.less';

export const FADE_IN_DURATION = 375;
export const FADE_OUT_DURATION = 650;

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
