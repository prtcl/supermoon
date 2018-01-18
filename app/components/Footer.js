import { p, a, footer } from '@hyperapp/html';
import './Footer.less';

const Footer = () => (
  footer({ class: 'Footer' }, [
    p({}, [
      a({ href: 'https://github.com/prtcl/supermoon' }, 'Supermoon'),
      ' by ',
      a({ href: 'http://prtcl.cc' }, 'Cory O\'Brien'),
      ' © 2015-2018'
    ])
  ])
);

export default Footer;
