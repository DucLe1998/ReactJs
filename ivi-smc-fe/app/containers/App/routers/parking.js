// import MapIndoorManagement from 'containers/MapIndoorManagement/Loadable';
import ParkingManagement from 'containers/ParkingManagement/Loadable';
import ParkingAddManagement from 'containers/ParkingManagement/AddParking';
import ParkingEditManagement from 'containers/ParkingManagement/EditParking';
import ParkingEntryPoints from 'containers/ParkingEntryPoints/Loadable';
import ParkingLanesManagement from 'containers/ParkingLanesManagement/Loadable';
import ParkingDevicesManagement from 'containers/ParkingDevicesManagement/Loadable';
import ParkingApgsManagement from 'containers/ParkingApgsManagement/Loadable';
import ParkingVersions from 'containers/ParkingVersions/Loadable';
import ParkingCardsManagement from 'containers/ParkingCardsManagement/Loadable';
import ParkingServicesManagement from 'containers/ParkingServicesManagement/Loadable';
import AddServicesManagement from 'containers/ParkingServicesManagement/AddServices';
import ParkingPromote from 'containers/ParkingPromote/Loadable';
import ParkingVoucher from 'containers/ParkingPromote/voucher';
import ParkingCardTypeManagement from 'containers/ParkingCardTypeManagement/Loadable';
import ParkingOwnerManagement from 'containers/ParkingOwnerManagement/Loadable';
import AddOwnerManagement from 'containers/ParkingOwnerManagement/AddOwner';
import ParkingMonthReport from 'containers/ParkingReport/MonthReport';
import ParkingTimesReport from 'containers/ParkingReport/TimesReport';
import ParkingMoneyReport from 'containers/ParkingReport/MoneyReport';
import ParkingDiscountReport from 'containers/ParkingReport/DiscountReport';
import ParkingInOutReport from 'containers/ParkingReport/InOutReport';
import EditOwnerManagement from 'containers/ParkingOwnerManagement/AddOwner';
import BlackListManagement from 'containers/ParkingOwnerManagement/BlackList';
import ParkingLpnManagement from 'containers/ParkingOwnerManagement/Lpn';
import AddBlackListManagement from 'containers/ParkingOwnerManagement/AddBlackList';
import VehicleHistoryManagement from 'containers/VehicleHistoryManagement/Loadable';
import ParkingAlertManagement from 'containers/ParkingAlertManagement/Loadable';
// import ListPaymentHistory from 'containers/ListPaymentHistory/Loadable';

export default [
  // {
  //   exact: true,
  //   path: `/parking/map-indoor`,
  //   component: MapIndoorManagement,
  //   resourceCode: 'parking/map-indoor',
  //   scope: 'list',
  // },
  // {
  //   exact: true,
  //   path: `/parking/payment-history`,
  //   component: ListPaymentHistory,
  //   resourceCode: 'parking/payment',
  //   scope: 'list',
  // },
  {
    exact: true,
    path: `/parking/pklots`,
    component: ParkingManagement,
    resourceCode: 'parking/pklots',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/pklots/add`,
    component: ParkingAddManagement,
    resourceCode: 'parking/pklots',
    scope: 'create',
  },
  {
    exact: true,
    path: `/parking/pklots/edit/:id`,
    component: ParkingEditManagement,
    resourceCode: 'parking/pklots',
    scope: 'create',
  },
  {
    exact: true,
    path: `/parking/entry-points`,
    component: ParkingEntryPoints,
    resourceCode: 'parking/entry-points',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/lanes`,
    component: ParkingLanesManagement,
    resourceCode: 'parking/lanes',
    scope: 'get',
  },
  {
    exact: true,
    path: `/parking/devices`,
    component: ParkingDevicesManagement,
    resourceCode: 'parking/devices',
    scope: 'get',
  },
  {
    exact: true,
    path: `/parking/apgs`,
    component: ParkingApgsManagement,
    resourceCode: 'parking/apgs',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/version`,
    component: ParkingVersions,
    resourceCode: 'parking/version',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/cards`,
    component: ParkingCardsManagement,
    resourceCode: 'parking/cards',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/services`,
    component: ParkingServicesManagement,
    resourceCode: 'parking/services',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/edit-services/:id`,
    component: AddServicesManagement,
    resourceCode: 'parking/add-services ',
    scope: 'create',
  },
  {
    exact: true,
    path: `/parking/add-services/`,
    component: AddServicesManagement,
    resourceCode: 'parking/add-services ',
    scope: 'create',
  },
  {
    exact: true,
    path: `/parking/promote`,
    component: ParkingPromote,
    resourceCode: 'parking/promote',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/voucher`,
    component: ParkingVoucher,
    resourceCode: 'parking/voucher',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/card-type`,
    component: ParkingCardTypeManagement,
    resourceCode: 'parking/card-type',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/owner`,
    component: ParkingOwnerManagement,
    resourceCode: 'parking/owner',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/blacklist`,
    component: BlackListManagement,
    resourceCode: 'parking/owner ',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/owner/add`,
    component: AddOwnerManagement,
    resourceCode: 'parking/owner ',
    scope: 'create',
  },
  {
    exact: true,
    path: `/parking/owner/edit/:id`,
    component: EditOwnerManagement,
    resourceCode: 'parking/owner ',
    scope: 'create',
  },
  {
    exact: true,
    path: `/parking/blacklist/add`,
    component: AddBlackListManagement,
    resourceCode: 'parking/owner ',
    scope: 'create',
  },
  {
    exact: true,
    path: `/parking/lpns`,
    component: ParkingLpnManagement,
    resourceCode: 'parking/owner',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/vehicle-history`,
    component: VehicleHistoryManagement,
    resourceCode: 'parking/vehicle-history',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/alerts`,
    component: ParkingAlertManagement,
    resourceCode: 'parking/alerts',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/month-report`,
    component: ParkingMonthReport,
    resourceCode: 'parking/month-report',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/times-report`,
    component: ParkingTimesReport,
    resourceCode: 'parking/timnes-report',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/money-report`,
    component: ParkingMoneyReport,
    resourceCode: 'parking/money-report',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/discount-report`,
    component: ParkingDiscountReport,
    resourceCode: 'parking/discount-report',
    scope: 'list',
  },
  {
    exact: true,
    path: `/parking/in-out-report`,
    component: ParkingInOutReport,
    resourceCode: 'parking/in-out-report',
    scope: 'list',
  },
];
