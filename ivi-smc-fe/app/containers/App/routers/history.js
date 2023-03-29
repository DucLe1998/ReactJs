import RegisterHistory from 'containers/Intercom/History/Register';
import CallHistory from 'containers/Intercom/History/Call';
import ElevatorHistory from 'containers/Intercom/History/Elevator';
import ImportHistory from 'containers/Intercom/History/Import';

export default [
  {
    exact: true,
    path: `/intercom/register-history`,
    component: RegisterHistory,
  },
  {
    exact: true,
    path: `/intercom/call-history`,
    component: CallHistory,
  },
  {
    exact: true,
    path: `/intercom/elevator-history`,
    component: ElevatorHistory,
  },
  {
    exact: true,
    path: `/intercom/import-history`,
    component: ImportHistory,
  },
];
