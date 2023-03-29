import timeMessages from 'containers/Common/Messages/time';
import { add, format, set } from 'date-fns';
import { min2Time } from 'utils/functions';
const formatDate = (date) => format(new Date(date), 'yyyy-MM-dd');
const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');
const renderTime = (startMinutes = 0, endMinutes = 0) =>
  `${format(min2Time(startMinutes), 'HH:mm')} - ${format(
    min2Time(endMinutes),
    'HH:mm',
  )}`;
const blockTime = 30;
const getStartTime = () => {
  const today = new Date();
  const currentMinute = today.getMinutes();
  const startBlock = Math.ceil(currentMinute / blockTime);
  const startTime = set(today, {
    minutes: startBlock * blockTime,
  });
  const endTime = add(startTime, { minutes: blockTime });
  return {
    startTime,
    endTime,
  };
};
const getStartTimeStep = (time) => {
  const today = new Date();
  const startTime = set(today, {
    hours: 8,
    minutes: 0,
  });
  const endTime = add(startTime, { minutes: time * 60 });
  return {
    startTime,
    endTime,
  };
};

const generateId = () =>
  Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
const WEEKDAYS = [
  {
    label: timeMessages.monday_short,
    value: 'MONDAY',
    id: 1,
  },
  {
    label: timeMessages.tuesday_short,
    value: 'TUESDAY',
    id: 2,
  },
  {
    label: timeMessages.wednesday_short,
    value: 'WEDNESDAY',
    id: 3,
  },
  {
    label: timeMessages.thursday_short,
    value: 'THURSDAY',
    id: 4,
  },
  {
    label: timeMessages.friday_short,
    value: 'FRIDAY',
    id: 5,
  },
  {
    label: timeMessages.saturday_short,
    value: 'SATURDAY',
    id: 6,
  },
  {
    label: timeMessages.sunday_short,
    value: 'SUNDAY',
    id: 7,
  },
];
const getDayOfWeeks = (days) => {
  if (!days || !days.length) return [];
  const map = WEEKDAYS.reduce(
    (total, cur) => ({ ...total, [cur.value]: cur }),
    {},
  );
  return days.map((d) => map[d]).sort((a, b) => a.id - b.id);
};

const STATUS_MAP = {
  WAITING: { color: 'blue', text: 'Đang chờ', key: 'WAITING' },
  CANCELLED: { color: 'blueGrey', text: 'Đã hủy', key: 'CANCELLED' },
  COMPLETE: { color: 'green', text: 'Hoàn thành', key: 'COMPLETE' },
  APPROVED: { color: 'purple', text: 'Đã duyệt', key: 'APPROVED' },
  UNSUCCESSFUL: { color: 'red', text: 'Không thành công', key: 'UNSUCCESSFUL' },
  OUT_OF_DATE: { color: 'orange', text: 'Quá hạn', key: 'OUT_OF_DATE' },
};
const STATUS_APPROVE_MAP = {
  WAITING: { key: 'WAITING', text: 'Đang chờ', color: 'blue' },
  APPROVED: { key: 'APPROVED', text: 'Đã duyệt', color: 'green' },
  REJECTED: { key: 'REJECTED', text: 'Từ chối', color: 'red' },
};
// const getStatusApproval = (me, ticket) => {
//   switch (ticket) {
//     case 'CANCELLED':
//     case 'OUT_OF_DATE':
//     case 'APPROVED':
//     case 'UNSUCCESSFUL':
//       return ticket;
//     case 'WAITING':
//     case 'COMPLETE':
//     default:
//       return me;
//   }
// };
const REPEAT_TYPE_MAP = {
  ONCE: { key: 'ONCE', value: 'Một lần' },
  WEEKLY: { key: 'WEEKLY', value: 'Lặp lại' },
};

const STATUS_APPROVAL = {
  WAITING: 'Chưa phê duyệt',
  APPROVED: 'Đã phê duyệt',
  REJECTED: 'Đã từ chối',
  UNSUCCESSFUL: 'Không thành công',
};

const STATUS_DEVICE = {
  NOT_ARRIVED: 'Chưa đến',
  ARRIVED: 'Đã đến',
  RETURNED_CARD: 'Đã trả thẻ',
  LEAVE: 'Đã ra',
  ISSUED_DEVICE: 'Thẻ đã cấp',
};

export {
  renderTime,
  getCurrentDate,
  getStartTime,
  getStartTimeStep,
  // getEndTime,
  formatDate,
  generateId,
  WEEKDAYS,
  getDayOfWeeks,
  blockTime,
  STATUS_APPROVE_MAP,
  STATUS_APPROVAL,
  STATUS_DEVICE,
  STATUS_MAP,
  REPEAT_TYPE_MAP,
};
