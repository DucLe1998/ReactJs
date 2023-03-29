import { defineMessages } from 'react-intl';

export const scope = 'app.column';

export default defineMessages({
  order: {
    id: `${scope}.order`,
    defaultMessage: 'Order',
  },
  name: {
    id: `${scope}.name`,
    defaultMessage: 'Name',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Description',
  },
  action: {
    id: `${scope}.action`,
    defaultMessage: 'Action',
  },
  status: {
    id: `${scope}.status`,
    defaultMessage: 'Status',
  },
  area: {
    id: `${scope}.area`,
    defaultMessage: 'Area',
  },
  date: {
    id: `${scope}.date`,
    defaultMessage: 'Date',
  },
  fromDate: {
    id: `${scope}.fromDate`,
    defaultMessage: 'Start date',
  },
  toDate: {
    id: `${scope}.toDate`,
    defaultMessage: 'End date',
  },
  startTime: {
    id: `${scope}.startTime`,
    defaultMessage: 'Start time',
  },
  endTime: {
    id: `${scope}.endTime`,
    defaultMessage: 'End time',
  },
});
