
export const showModal = (shouldShowModal) => (state) => ({ ...state, shouldShowModal });

export const fetchSites = () => (state, { handleSites, selectSite }) => (
  fetch('/api/sites')
    .then((res) => res.json())
    .then((sites) => {
      handleSites(sites);
      selectSite(sites[0].id);
    })
);

export const handleSites = (sites) => (state) => ({ ...state, sites });

export const selectSite = (id) => () => console.log(id);

export const runVisualization = () => (state, { showModal }) => {
  showModal(false);
};
