import { p } from '@hyperapp/html';
import Modal from './Modal';
import './ErrorModal.less';

const ErrorModal = ({
  error,
  ...rest
}) => (
  Modal({
    ...rest,
    class: 'ErrorModal'
  }, [
    p({}, error)
  ])
);

export default ErrorModal;
