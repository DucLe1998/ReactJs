import App from 'containers/Upgrade/App/Loadable';
import AppManagement from 'containers/Upgrade/AppManagement/Loadable';
import FirmwareManagement from 'containers/Upgrade/FirmwareManagement/Loadable';
import Firmware from 'containers/Upgrade/Firmware/Loadable';
export default [
  {
    exact: true,
    path: `/upgrade/app`,
    component: App,
  },
  {
    exact: true,
    path: `/upgrade/app_management`,
    component: AppManagement,
  },
  {
    exact: true,
    path: `/upgrade/firmware_management`,
    component: FirmwareManagement,
  },
  {
    exact: true,
    path: `/upgrade/firmware`,
    component: Firmware,
  },
];
