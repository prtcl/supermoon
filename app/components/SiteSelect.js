import { h } from 'hyperapp';

const Site = ({ site }) => (
  h('option', { value: site.id }, site.name)
);

const SiteSelect = ({ sites, onSelectSite }) => (
  h('select', { onchange: (e) => onSelectSite(e.target.value) }, [
    sites.map((site) => Site({ site }))
  ])
);

export default SiteSelect;
