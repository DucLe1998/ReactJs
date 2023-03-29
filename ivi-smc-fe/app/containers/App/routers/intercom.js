import Server from 'containers/Intercom/Server/Loadable';
import Device from 'containers/Intercom/Device/Loadable';

export default [
  {
    exact: true,
    path: `/intercom/servers`,
    component: Server,
  },
  {
    exact: true,
    path: `/intercom/devices`,
    component: Device,
  },
];
