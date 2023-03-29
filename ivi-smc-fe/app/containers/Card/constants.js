export const key = 'CardMng';
export const DEFAULT_FILTER = {
  keyword: '',
  limit: 25,
  page: 1,
  cardStatus: '',
  cardType: '',
  cardUserType: '',
  group: null,
  createdAt: [],
};
export const STATUS_MAP = new Map([
  ['NEW', 'Chưa cấp'],
  ['AVAILABLE', 'Đã trả'],
  ['ACTIVE', 'Đã cấp còn hiệu lực'],
  ['INACTIVE', 'Đã cấp hết hiệu lực'],
]);

export const USER_TYPE_MAP = new Map([
  ['USER', 'Nhân viên'],
  ['GUEST', 'Khách'],
  ['NONE', 'Chưa định danh'],
]);
export const TYPE_MAP = ['PROXIMITY', 'MIFARE', 'UHF'];
