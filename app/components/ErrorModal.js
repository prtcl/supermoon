import { p } from '@hyperapp/html';
import Modal from './Modal';
import './ErrorModal.less';

const ErrorModal = ({ error }) => (
  Modal({
    class: 'ErrorModal'
  }, [
    p({}, error)
  ])
);

export default ErrorModal;
