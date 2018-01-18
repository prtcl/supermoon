import { h } from 'hyperapp';

const Footer = () => (
  h('footer', {}, [
    h('p', {}, [
      h('a', { href: 'https://github.com/prtcl/supermoon' }, 'Supermoon'),
      ' by ',
      h('a', { href: 'http://prtcl.cc' }, 'Cory O\'Brien'),
      ' © 2015-2018'
    ])
  ])
);

export default Footer;
