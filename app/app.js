import { h, app } from 'hyperapp';
import logger from '@hyperapp/logger';
import { state, actions } from './store';
import './app.less';
import InfoModal from './components/InfoModal';
import SiteSelect from './components/SiteSelect';
import Footer from './components/Footer';
import ErrorModal from './components/ErrorModal';

const view = ({
  error,
  isLoading,
  isRunning,
  shouldShowModal,
  sites,
}, {
  selectSite,
  runVisualization
}) => (
  h('main', { class: 'app' }, [
    isRunning && [
      SiteSelect({
        sites,
        onSelectSite: selectSite
      }),
      Footer()
    ],
    shouldShowModal && InfoModal({ onClose: runVisualization }),
    isLoading && ErrorModal({ error: 'Loading...' }),
    error && ErrorModal({ error })
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
