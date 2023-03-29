/*
 *
 * GuestDashboard constants
 *
 */

export const DEFAULT_ACTION = 'app/GuestDashboard/DEFAULT_ACTION';
export const INIT_SEARCH_VALUE = {
  limit: 25,
  page: 1,
};
export const TIME_TYPES = [
  { label: '7 Ngày', value: 'DAY_7' },
  { label: '4 Tuần', value: 'WEEK_4' },
  { label: '12 Tháng', value: 'MONTH_12' },
];
export const DEFAULT_SERIES = [
  {
    name: 'Tổng số khách',
    code: 'TOTALGUEST',
    color: '#8B8CC7',
  },
  {
    name: 'Khách đã đến',
    code: 'ARRIVED',
    color: '#6264A7',
  },
  {
    name: 'Khách còn hạn',
    code: 'AVAIABLED',
    color: '#D9DBDB',
  },
  {
    name: 'Khách hết hạn',
    code: 'EXPIRED',
    color: '#464775',
  },
  {
    name: 'Khuôn mặt',
    code: 'FACES',
    color: '#2B78E4',
  },
  {
    name: 'Thẻ',
    code: 'CARDS',
    color: '#FF9800',
  },
  {
    name: 'Vân tay',
    code: 'FINGERPRINTS',
    color: '#109CF1',
  },
];
