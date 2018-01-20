import { h, app } from 'hyperapp';
import logger from '@hyperapp/logger';
import { state, actions } from './store';
import './app.less';
import ErrorModal from './components/ErrorModal';
import InfoModal from './components/InfoModal';
import Visualization from './screens/Visualization';

const view = ({
  error,
  isLoading,
  isRunning,
  shouldShowInfo,
  sites,
  synth,
}, {
  selectSite,
  runVisualization
}) => (
  h('main', { class: 'app' }, [
    isRunning && Visualization({
      synth,
      sites,
      onSelectSite: selectSite
    }),
    shouldShowInfo && InfoModal({ onClose: runVisualization }),
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
