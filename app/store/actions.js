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

export const selectSite = (id) => (state, { setIsLoading }) => {
  setIsLoading(true);
};

export const setIsLoading = (isLoading) => (state) => ({
  ...state,
  isLoading
});

export const runVisualization = () => (state) => ({
  ...state,
  isRunning: true,
  shouldShowModal: false
});
