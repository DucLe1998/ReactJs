export const key = 'department';
export const LIST_STATUS = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngưng hoạt động' },
];
export const STATUS_MAP = LIST_STATUS.reduce(
  (total, cur) => ({
    ...total,
    [cur.value]: cur,
  }),
  {},
);
export const defaultNew = {
  description: '',
  groupCode: '',
  groupName: '',
  isPnLVGR: true,
  status: 'ACTIVE',
};
