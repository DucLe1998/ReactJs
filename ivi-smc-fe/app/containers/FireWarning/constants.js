/*
 *
 * ListWarning constants
 *
 */
// import { subDays } from 'date-fns';
import messages from './messages';
const scope = 'app/ListWarning';

export const ISSUES_TYPE = [
  { id: 'ACTUAL_FIRE_ALARM', name: 'Thông báo cháy' },
  { id: 'FAKE_FIRE_ALARM', name: 'Thông báo cháy giả' },
  {
    id: 'PRACTISE_FIRE_ALARM',
    name: 'Toà nhà đang tiến hành diễn tập',
  },
];

export const WARNING_STATUS = [
  { id: 'DANGEROUS', color: 'red', text: 'Nguy hiểm' },
  {
    id: 'LOW',
    color: 'green',
    text: 'Thấp',
  },
  {
    id: 'MEDIUM',
    color: 'blue',
    text: 'Trung bình',
  },
  {
    id: 'HIGH',
    color: 'yellow',
    text: 'Cao',
  },
];
