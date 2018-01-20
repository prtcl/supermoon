import { h, app } from 'hyperapp';
import logger from '@hyperapp/logger';
import { state, actions } from './store';
import './app.less';
import InfoModal from './components/InfoModal';
import SiteSelect from './components/SiteSelect';
import Footer from './components/Footer';
import * as SynthEngine from './synth';

window.SynthEngine = SynthEngine;
console.log(window.synth = SynthEngine.create());

const view = ({
  shouldShowModal,
  sites
}, {
  selectSite,
  runVisualization
}) => (
  h('main', { class: 'app' }, [
    !shouldShowModal && SiteSelect({
      sites,
      onSelectSite: selectSite
    }),
    Footer(),
    shouldShowModal ? InfoModal({ onClose: runVisualization }) : null
  ])
);

const run = () => {
  const { fetchSites } = logger()(app)(
    state,
    actions,
    view,
    document.body
  );
  fetchSites();
};

window.addEventListener('load', run);
