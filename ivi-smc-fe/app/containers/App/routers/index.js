import accessControll from './accessControll';
import cameraAi from './cameraAi';
import registration from './registration';
import profile from './profile';
import user from './user';
import company from './company';
import intercom from './intercom';
import history from './history';
import upgrade from './upgrade';
// import appManagement from './appManagement';
import parking from './parking';
// import statistics from './statistics';
// import fireWarning from './fireWarning';
import notifications from './notifications';
import card from './card';
import navigation from './navigation';
import category from './category';
export default [
  ...accessControll,
  ...cameraAi,
  ...profile,
  ...user,
  ...registration,
  ...company,
  // ...appManagement,
  ...parking,
  // ...statistics,
  // ...fireWarning,
  ...notifications,
  ...card,
  ...navigation,
  ...category,
  ...intercom,
  ...upgrade,
  ...history,
];
