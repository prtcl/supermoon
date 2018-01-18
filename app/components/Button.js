import { button } from '@hyperapp/html';
import './Button.less';

const Button = ({
  text,
  onClick
}) => (
  button({
    class: 'Button',
    onclick: onClick
  }, text)
);

export default Button;
