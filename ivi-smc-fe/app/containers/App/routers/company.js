import ListCompany from 'containers/Department';
import DetailsCompany from 'containers/Department/details';
export default [
  {
    exact: true,
    path: `/department`,
    component: ListCompany,
    // resourceCode: 'iam/org-unit',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/department/:id`,
    component: DetailsCompany,
    // resourceCode: 'iam/org-unit',
    // scope: 'get',
  },
];
