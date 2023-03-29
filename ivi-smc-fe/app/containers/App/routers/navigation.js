import Navigation from 'containers/Navigation';
import MapPoint from 'containers/MapPoint';
export default [
  {
    exact: true,
    path: '/navigation',
    component: Navigation,
  },
  {
    exact: true,
    path: '/navigation/point',
    component: MapPoint,
  },
];
