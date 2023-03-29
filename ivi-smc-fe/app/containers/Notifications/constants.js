export const key = 'notificationContainer';
export const DEFAULT_FILTER = {
  eventTypes: [],
  statuses: [],
  createAt: [],
  notificationAt: [],
  keyword: '',
  limit: 25,
  page: 1,
  // sort: '-createdAt',
  eventSources: 'USER',
};
export const LIST_STATUS = [
  {
    text: 'Đã hủy',
    id: 'CANCELLED',
    color: 'red',
  },
  {
    text: 'Đã thực hiện',
    id: 'DONE',
    color: 'green',
  },
  {
    text: 'Chờ thực hiện',
    id: 'WAITING',
    color: 'blue',
  },
];

export const STATUS_MAP = LIST_STATUS.reduce(
  (total, cur) => ({
    ...total,
    [cur.id]: cur,
  }),
  {},
);
export const LIST_EVENT_TYPE = [
  {
    name: 'Hoạt động',
    id: 'ACTION',
  },
  // {
  //   name: 'Hệ thống',
  //   id: 'SYSTEM',
  // },
  {
    name: 'Cảnh báo',
    id: 'WARNING',
  },
  {
    name: 'Khuyến mại',
    id: 'ADVERTISEMENT',
  },
];

export const TYPE_LIST_MAP = LIST_EVENT_TYPE.reduce(
  (total, cur) => ({
    ...total,
    [cur.id]: cur,
  }),
  {},
);
