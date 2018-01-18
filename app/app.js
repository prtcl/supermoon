import { h, app } from 'hyperapp';
import { state, actions } from './store';
import InfoModal from './components/InfoModal';
import SiteSelect from './components/SiteSelect';
import Footer from './components/Footer';

const view = ({ sites }, { selectSite, runVisualization }) => (
  h('main', {}, [
    SiteSelect({ sites, onSelectSite: selectSite }),
    Footer(),
    InfoModal({ onClose: runVisualization })
  ])
);

const run = () => {
  const { fetchSites } = app(
    state,
    actions,
    view,
    document.body
  );
  fetchSites();
};

window.addEventListener('load', run);
