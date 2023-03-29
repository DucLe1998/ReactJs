import FireWarning from 'containers/FireWarning/Loadable';
import ListEventFireAlarm from 'containers/ListEventFireAlarm/Loadable';
import Details from 'containers/FireWarning/Details';
import FireAlarmArea from 'containers/FireAlarmArea/Loadable';
import AddFireAlarmArea from 'containers/FireAlarmArea/screens/Add';

export default [
  {
    exact: true,
    path: `/fire-warning`,
    component: FireWarning,
    resourceCode: 'fire-alarm/issue',
    scope: 'list',
  },
  {
    exact: true,
    path: `/fire-warning/:id`,
    component: Details,
    resourceCode: 'fire-alarm/issue',
    scope: 'get',
  },
  {
    exact: true,
    path: `/fire-alarm-area`,
    component: FireAlarmArea,
    // resourceCode: 'fire-alarm/issue',
    // scope: 'get',
  },
  {
    exact: true,
    path: `/fire-alarm-area/add`,
    component: AddFireAlarmArea,
    // resourceCode: 'fire-alarm/issue',
    // scope: 'get',
  },
  {
    exact: true,
    path: `/fire-alarm-area/:id/:mode`,
    component: AddFireAlarmArea,
    // resourceCode: 'fire-alarm/issue',
    // scope: 'get',
  },
];
