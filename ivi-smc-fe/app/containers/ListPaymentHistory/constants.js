/*
 *
 * ListPaymentHistory constants
 *
 */
import { sub, startOfDay } from 'date-fns';

export const MIN_DATE = sub(startOfDay(new Date()), {
  months: 3,
});

export const PAYMENT_VINID_STATUS = [
  { id: null, name: 'Tất cả' },
  { id: 'false', name: 'Thất bại' },
  { id: 'true', name: 'Thành công' },
];

export const PAYMENT_PARKING_STATUS = [
  { id: null, name: 'Tất cả' },
  { id: 'false', name: 'Thất bại' },
  { id: 'true', name: 'Thành công' },
];

export const INIT_SEARCH_VALUE = {
  keyword: '',
  limit: 25,
  page: 1,
  areaId: +process.env.AREA_ID,
  buildingId: +process.env.BLOCK_ID,
  fromDate: MIN_DATE,
  toDate: null,
  paymentVinIDStatus: PAYMENT_VINID_STATUS[0],
  paymentParkingStatus: PAYMENT_PARKING_STATUS[0],
  from: '',
  to: '',
};

export const DEFAULT_ACTION = 'app/ListPaymentHistory/DEFAULT_ACTION';
