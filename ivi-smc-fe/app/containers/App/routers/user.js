// import HumanDashboard from 'containers/HumanDashboard/Loadable';
// import ImportHistory from 'containers/ImportHistory';
import AddUserPolicy from 'containers/Policy/addUser';
import Policy from 'containers/Policy/Loadable';
import DetailUser from 'containers/User/details';
import User from 'containers/User/Loadable';
import AddUser from 'containers/User/add';

export default [
  // {
  //   exact: true,
  //   path: `/user/import-history`,
  //   component: ImportHistory,
  //   resourceCode: 'iam/user',
  //   scope: 'list',
  // },
  // {
  //   exact: true,
  //   path: `/user/dashboard`,
  //   component: HumanDashboard,
  //   resourceCode: 'iam/org-unit',
  //   scope: 'list',
  // },
  {
    exact: true,
    path: `/user`,
    component: User,
    resourceCode: 'iam/user',
    scope: 'list',
  },
  {
    exact: true,
    path: `/user/create`,
    component: AddUser,
    resourceCode: 'iam/user',
    scope: 'create',
  },
  {
    // exact: true,
    path: `/user/details/:id`,
    component: DetailUser,
    resourceCode: 'iam/user',
    scope: 'get',
  },
  {
    exact: true,
    path: `/list-policy`,
    component: Policy,
    resourceCode: 'iam/policy',
    scope: 'list',
  },
  {
    exact: true,
    path: `/list-policy/:id/users`,
    component: AddUserPolicy,
    resourceCode: 'iam/policy',
    scope: 'get',
  },
];
