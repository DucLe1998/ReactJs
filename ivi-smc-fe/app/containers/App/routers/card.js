import Card from 'containers/Card/Loadable';
import CardDetails from 'containers/Card/details';
// import HistoryCard from 'containers/Card/screens/HistoryCard';
// import CardDashboard from 'containers/CardDashboard';
// import CardEmployeeDetails from 'containers/CardDashboard/screens/CardEmployeeDetails';
// import CardGuestDetails from 'containers/CardDashboard/screens/CardGuestDetails';

export default [
  {
    exact: true,
    path: `/card`,
    component: Card,
    // resourceCode: 'access-control/card',
    // scope: 'list',
  },
  {
    exact: true,
    path: `/card/:id`,
    component: CardDetails,
    // resourceCode: 'access-control/card',
    // scope: 'get',
  },
  // {
  //   exact: true,
  //   path: `/card/history/details`,
  //   component: HistoryCard,
  // },
  // {
  //   exact: true,
  //   path: `/card-dashboard`,
  //   component: CardDashboard,
  // },
  // {
  //   exact: true,
  //   path: `/card-dashboard/card-employee`,
  //   component: CardEmployeeDetails,
  // },
  // {
  //   exact: true,
  //   path: `/card-dashboard/card-guest`,
  //   component: CardGuestDetails,
  // },
];
