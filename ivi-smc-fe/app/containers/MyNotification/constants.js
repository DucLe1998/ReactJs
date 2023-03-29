/* eslint-disable react/react-in-jsx-scope */
export const key = 'MyNotification';
export const DEFAULT_FILTER = {
  limit: 25,
  page: 1,
  keyword: '',
  isRead: 'ALL',
  fromDate: undefined,
  toDate: undefined,
};
export const READ_STATUS = [
  {
    label: 'Tất cả',
    value: 'ALL',
  },
  {
    label: 'Chưa đọc',
    value: 'UNREAD',
  },
  {
    label: 'Đã đọc',
    value: 'READ',
  },
];
export const READ_STATUS_MAP = {
  ALL: undefined,
  UNREAD: false,
  READ: true,
};
