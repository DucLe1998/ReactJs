import Feedback from 'containers/Feedback';
import FeedbackDetails from 'containers/Feedback/details';
import Add from 'containers/NewsManagement/Add';
import Detail from 'containers/NewsManagement/Detail';
import NewsManagement from 'containers/NewsManagement/Loadable';
export default [
  {
    exact: true,
    path: `/management/app/new-management`,
    component: NewsManagement,
    resourceCode: 'appbe/article',
    scope: 'list',
  },
  {
    exact: true,
    path: `/management/app/new-management/add`,
    component: Add,
    resourceCode: 'appbe/article',
    scope: 'create',
  },
  {
    exact: true,
    path: `/management/app/new-management/:id/detail`,
    component: Detail,
    resourceCode: 'appbe/article',
    scope: 'get',
  },
  {
    exact: true,
    path: `/management/app/new-management/:id/edit`,
    component: Add,
    resourceCode: 'appbe/article',
    scope: 'update',
  },
  {
    exact: true,
    path: `/feedback`,
    component: Feedback,
    resourceCode: 'appbe/feedback',
    scope: 'list',
  },
  {
    exact: true,
    path: `/feedback/details/:id`,
    component: FeedbackDetails,
    resourceCode: 'appbe/feedback',
    scope: 'get',
  },
];
