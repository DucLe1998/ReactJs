export const key = 'feedbackContainer';

export const DEFAULT_FILTER = {
  types: null,
  status: null,
  startDate: null,
  endDate: null,
};

export const TYPE_LIST = [
  { id: 'INCIDENT', name: 'Sự cố' },
  { id: 'EVENT', name: 'Thắc mắc' },
  { id: 'REPORT', name: 'Phản ánh' },
  { id: 'OTHER', name: 'Khác' },
];

export const TYPE_LIST_MAP = TYPE_LIST.reduce(
  (total, cur) => ({
    ...total,
    [cur.id]: cur,
  }),
  {},
);

export const STATUS_LIST = [
  {
    id: 'NEW',
    text: 'Chưa phản hồi',
    color: 'red',
    level: 1,
  },
  {
    id: 'IN_PROGRESS',
    text: 'Đang xử lý',
    color: 'blue',
    level: 2,
  },
  {
    id: 'COMPLETED',
    text: 'Đã xử lý',
    color: 'green',
    level: 3,
  },
];

export const STATUS_LIST_MAP = STATUS_LIST.reduce(
  (total, cur) => ({
    ...total,
    [cur.id]: cur,
  }),
  {},
);
