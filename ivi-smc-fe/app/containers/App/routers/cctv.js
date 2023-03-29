import ListCamera from 'containers/ListCamera/Loadable';
import CameraDetails from 'containers/ListCamera/details';
import ListNVR from 'containers/ListNVR/Loadable';
import NVRDetail from 'containers/ListNVR/LoadableDetail';
import ListWarning from 'containers/ListWarning/Loadable';
import Library from 'containers/Library/Loadable';
import PlaybackCamera from 'containers/PlaybackCamera/Loadable';

export default [
  {
    exact: true,
    path: `/list-nvr`,
    component: ListNVR,
    resourceCode: 'cctv/devices',
    scope: 'list',
  },
  {
    exact: true,
    path: `/list-nvr/detail`,
    component: NVRDetail,
    resourceCode: 'cctv/devices',
    scope: 'get',
  },
  {
    exact: true,
    path: `/list-camera`,
    component: ListCamera,
    resourceCode: 'cctv/devices',
    scope: 'list',
  },
  {
    exact: true,
    path: `/list-camera/details/:id`,
    component: CameraDetails,
    resourceCode: 'cctv/devices',
    scope: 'get',
  },
  {
    exact: true,
    path: `/list-warning`,
    component: ListWarning,
    resourceCode: 'cctv/events',
    scope: 'list',
  },
  {
    exact: true,
    path: `/library`,
    component: Library,
    resourceCode: 'cctv/libraries',
    scope: 'list',
  },
  {
    exact: true,
    path: `/playback-camera`,
    component: PlaybackCamera,
    // resourceCode: 'cctv/live-views',
    resourceCode: 'cctv/playback-camera',
    scope: 'list',
  },
];
