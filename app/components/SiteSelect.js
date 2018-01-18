import { option, select } from '@hyperapp/html';
import './SiteSelect.less';

const Site = ({ site }) => (
  option({ value: site.id }, `${site.name} (${site.lat}, ${site.lng})`)
);

const SiteSelect = ({ sites, onSelectSite }) => (
  select({
    class: 'SiteSelect',
    onchange: (e) => onSelectSite(e.target.value)
  }, [
    sites.map((site) => Site({ site }))
  ])
);

export default SiteSelect;
