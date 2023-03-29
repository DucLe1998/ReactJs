import { defineMessages } from 'react-intl';

export const scope = 'app.status';

export default defineMessages({
  active: {
    id: `${scope}.active`,
    defaultMessage: 'Active',
  },
  unActive: {
    id: `${scope}.un_active`,
    defaultMessage: 'Inactive',
  },
  open: {
    id: `${scope}.opening`,
    defaultMessage: 'Opening',
  },
  close: {
    id: `${scope}.close`,
    defaultMessage: 'close',
  },
  normal: {
    id: `${scope}.normal`,
    defaultMessage: 'Normal',
  },
  lock: {
    id: `${scope}.lock`,
    defaultMessage: 'lock',
  },
  unLock: {
    id: `${scope}.un_lock`,
    defaultMessage: 'Un lock',
  },
  abNormal: {
    id: `${scope}.abnormal`,
    defaultMessage: 'Abnormal',
  },
  connected: {
    id: `${scope}.connected`,
    defaultMessage: 'Connected',
  },
  unConnected: {
    id: `${scope}.un_connected`,
    defaultMessage: 'Un connected',
  },
  missingStatus: {
    id: `${scope}.missing_status`,
    defaultMessage: 'Missing',
  },
});
