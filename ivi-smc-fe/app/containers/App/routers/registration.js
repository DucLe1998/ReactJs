import ManageGuests from 'containers/ManageGuests/Loadable';
import GuestFromOffice from 'containers/GuestFromOffice/Loadable';
import GuestFromOfficeDetail from 'containers/GuestFromOffice/Details';
import AddGuest from 'containers/ManageGuests/AddGuest';
import Details from 'containers/ManageGuests/Details';
import Approver from 'containers/ManageGuests/Approver';
import GuestDashboard from 'containers/GuestDashboard/Loadable';
import ListGuestStatistic from 'containers/GuestDashboard/ListGuestStatistic';
import DetailGuestOfCompany from 'containers/GuestDashboard/DetailGuestOfComapny';

export default [
  {
    exact: true,
    path: `/guests`,
    component: GuestFromOffice,
    resourceCode: 'guest-registration/guest',
    scope: 'list',
  },
  {
    exact: true,
    path: `/guests/:id`,
    component: GuestFromOfficeDetail,
    resourceCode: 'guest-registration/guest',
    scope: 'get',
  },
  {
    exact: true,
    path: `/guest-registrations`,
    component: ManageGuests,
    resourceCode: 'guest-registration/registration',
    scope: 'list',
  },
  {
    exact: true,
    path: `/guest-registrations/approver`,
    component: Approver,
    resourceCode: 'guest-registration/approver',
    scope: 'list',
  },
  {
    exact: true,
    path: `/guest-registrations/add-guest`,
    component: AddGuest,
    resourceCode: 'guest-registration/registration',
    scope: 'create',
  },
  {
    exact: true,
    path: `/guest-registrations/details/:id/:from`,
    component: Details,
    resourceCode: 'guest-registration/registration',
    scope: 'get',
  },
  {
    exact: true,
    path: `/guest-registrations/:id/:action`,
    component: AddGuest,
    resourceCode: 'guest-registration/registration',
    scope: 'update',
  },
  {
    exact: true,
    path: `/guest/dashboard`,
    component: GuestDashboard,
    // resourceCode: 'guest-registration/registration',
    // scope: 'update',
  },
  {
    exact: true,
    path: `/guest/dashboard/statistic`,
    component: ListGuestStatistic,
    // resourceCode: 'guest-registration/registration',
    // scope: 'update',
  },
  {
    exact: true,
    path: `/guest/dashboard/statistic/:companyId`,
    component: DetailGuestOfCompany,
    // resourceCode: 'guest-registration/registration',
    // scope: 'update',
  },
];
