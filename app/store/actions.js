import * as SynthEngine from '../synth';

export const fetchSites = () => (state, { addSites }) => (
  fetch('/api/sites')
    .then((res) => res.json())
    .then(addSites)
);

export const addSites = (sites) => (state) => ({
  ...state,
  sites: sites
    .filter((s) => s.isHealthy)
    .sort((a, b) => a.name.localeCompare(b.name))
});

export const selectSite = (id) => ({ sites, synth }, { setIsLoading, showError }) => {
  const site = sites.find((s) => s.id === id);
  setIsLoading(true);
  return synth.setStreamSource(site.stream)
    .then(() => {
      setIsLoading(false);
      synth.play();
    })
    .catch((err) => {
      showError(err.message);
    });
};

export const setIsLoading = (isLoading) => (state) => ({
  ...state,
  isLoading
});

export const showError = (error) => (state) => ({
  ...state,
  error
});

export const showUnsupportedError = () => (state) => ({
  ...state,
  error: 'It doesn\'t look like your browser supports Web Audio and ogg/vorbis playback. Please use a recent version of Chrome or Firefox.',
  isLoading: false,
  isRunning: false,
  shouldShowModal: false,
});

export const runVisualization = () => (state, { showUnsupportedError }) => {
  if (!SynthEngine.isCompatibleBrowser()) {
    return showUnsupportedError();
  }
  return {
    ...state,
    isRunning: true,
    shouldShowModal: false,
    synth: SynthEngine.create()
  };
};
