
module.exports = [
  {
    id: 'todmorden-uk',
    name: 'Todmorden, UK',
    url: 'http://78.46.38.217/vlf1',
    lat: 53.703,
    lng: -2.072
  },
  {
    id: 'bielefeld-germany',
    name: 'Bielefeld, Germany',
    url: 'http://78.46.38.217/vlf6',
    lat: 52.146,
    lng: 8.458
  },
  {
    id: 'cumiana-nw-italy',
    name: 'Cumiana, NW Italy',
    url: 'http://78.46.38.217/vlf15',
    lat: 44.96,
    lng: 7.42
  },
  {
    id: 'sheffield-uk',
    name: 'Sheffield, UK',
    url: 'http://78.46.38.217/vlf3',
    lat: 53.4396,
    lng: -1.5004
  },
  {
    id: 'sebring-florida',
    name: 'Sebring, Florida',
    url: 'http://78.46.38.217/vlf19',
    lat: 27.516,
    lng: 81.517
  },
  {
    id: 'forest-virginia',
    name: 'Forest, Virginia',
    url: 'http://78.46.38.217/vlf35',
    lat: 37.34385,
    lng: -79.28818
  },
  {
    id: 'surfside-beach-south-carolina',
    name: 'Surfside Beach, South Carolina',
    url: 'http://78.46.38.217/vlf34',
    lat: 33.6213,
    lng: 78.9649
  }
].map((s) => Object.assign({}, s, {
  isHealthy: false,
  stream: `/stream/${s.id}`
}));
