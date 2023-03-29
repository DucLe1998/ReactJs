import ACDevice from 'containers/AC/ACDevice/Loadable';
import DetailDevices from 'containers/AC/ACDevice/DetailDevices';
import ACGroupUser from 'containers/AC/ACGroupUser/Loadable';
import ACDoor from 'containers/AC/ACDoor/Loadable';
import DetailDoor from 'containers/AC/ACDoor/DetailDoor';
import ACSchedule from 'containers/AC/ACSchedule/Loadable';
import DetailSchedule from 'containers/AC/ACSchedule/DetailSchedule';
import ACDoorAccess from 'containers/AC/ACDoorAccess/Loadable';
import DetailDoorAccess from 'containers/AC/ACDoorAccess/DetailDoorAccess';
import ACGroupAccess from 'containers/AC/ACGroupAccess/Loadable';
import DetailAccessGroup from 'containers/AC/ACGroupAccess/DetailAccessGroup';
import AcEvent from 'containers/AC/ACWarningAndMonitor/AcEvent/Loadable';
import DashboardMonitorEvent from 'containers/AC/ACWarningAndMonitor/DashboardMonitorEvent/Loadable';

export default [
  {
    exact: true,
    path: `/access-control/event`,
    component: AcEvent,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/event-dashboard`,
    component: DashboardMonitorEvent,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/group-access`,
    component: ACGroupAccess,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/group-access/:type/:id`,
    component: DetailAccessGroup,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/devices`,
    component: ACDevice,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/devices/:id`,
    component: DetailDevices,
    // resourceCode: 'access-control/devices',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/group-user`,
    component: ACGroupUser,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/door`,
    component: ACDoor,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/ac-door/:type/:id`,
    component: DetailDoor,
    // resourceCode: 'access-control/devices',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/schedule`,
    component: ACSchedule,
    // resourceCode: 'access-control/device',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/schedule/:type/:id`,
    component: DetailSchedule,
  },

  {
    exact: true,
    path: `/access-control/door-access`,
    component: ACDoorAccess,
    // resourceCode: 'access-control/devices',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/door-access/:type`, // CREATE
    component: DetailDoorAccess,
    // resourceCode: 'access-control/devices',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/access-control/door-access/:type/:id`, // UPDATE + DETAIL
    component: DetailDoorAccess,
    // resourceCode: 'access-control/devices',
    // scope: 'list',
  },
];
