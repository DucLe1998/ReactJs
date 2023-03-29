import Notifications from 'containers/Notifications';
import Details from 'containers/Notifications/details';
import MyNotification from 'containers/MyNotification';
import MyNotificationDetails from 'containers/MyNotification/details';
export default [
  {
    exact: true,
    path: `/me-notification`,
    component: MyNotification,
    // resourceCode: 'notification/event',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/notification`,
    component: Notifications,
    resourceCode: 'notification/event',
    scope: 'list',
  },
  {
    exact: true,
    path: `/notification/create`,
    component: Details,
    resourceCode: 'notification/event',
    scope: 'create',
  },
  {
    exact: true,
    path: `/notification/details/:id`,
    component: Details,
    resourceCode: 'notification/event',
    scope: 'get',
  },
  {
    exact: true,
    path: `/me-notification/:id`,
    component: MyNotificationDetails,
    // resourceCode: 'notification/event',
    // scope: 'get',
  },
];
