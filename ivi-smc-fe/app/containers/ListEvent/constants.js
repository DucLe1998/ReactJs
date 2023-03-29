/*
 *
 * ListEvent constants
 *
 */
export const key = 'CamAIEvent';
export const DEFAULT_FILTER = {
  limit: 25,
  page: 1,
  keyword: '',
  eventType: null,
  device: null,
  status: undefined,
  area: null,
  startTime: null,
  endTime: null,
};
export const STATUS_MAP = new Map([
  [
    'NEW',
    {
      color: 'red',
      text: 'Chưa xử lý',
    },
  ],
  [
    'INVALID_WARNING',
    {
      color: 'orange',
      text: 'Báo sai',
    },
  ],
  [
    'PROCESSING',
    {
      color: 'blue',
      text: 'Đang xử lý',
    },
  ],
  [
    'COMPLETED',
    {
      color: 'green',
      text: 'Hoàn thành',
    },
  ],
]);
