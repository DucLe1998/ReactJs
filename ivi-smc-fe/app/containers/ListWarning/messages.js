/*
 * ListWarning Messages
 *
 * This contains all the text for the ListWarning container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.ListWarning';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'List Warning',
  },
  column_deviceName: {
    id: `${scope}.column.deviceName`,
    defaultMessage: 'Device Name',
  },
  column_deviceType: {
    id: `${scope}.column.deviceType`,
    defaultMessage: 'Device Type',
  },
  column_warningType: {
    id: `${scope}.column.warningType`,
    defaultMessage: 'Warning Type',
  },
  column_description: {
    id: `${scope}.column.description`,
    defaultMessage: 'Note',
  },
  detail: {
    id: `${scope}.detail`,
    defaultMessage: 'Warning Info',
  },
  history: {
    id: `${scope}.history`,
    defaultMessage: 'History',
  },
  tooltip_changeStatus: {
    id: `${scope}.tooltip.changeStatus`,
    defaultMessage: 'Change status',
  },
  status_NEW: {
    id: `${scope}.status.NEW`,
    defaultMessage: 'NEW',
  },
  status_INPROGRESS: {
    id: `${scope}.status.INPROGRESS`,
    defaultMessage: 'INPROGRESS',
  },
  status_RESOLVED: {
    id: `${scope}.status.RESOLVED`,
    defaultMessage: 'RESOLVED',
  },
  status_CLOSED: {
    id: `${scope}.status.CLOSED`,
    defaultMessage: 'CLOSED',
  },
  title_changeStatus: {
    id: `${scope}.title.changeStatus`,
    defaultMessage:
      'Change status of {length, plural, =1 {# selected warning} other {# selected warnings}}',
  },
});
