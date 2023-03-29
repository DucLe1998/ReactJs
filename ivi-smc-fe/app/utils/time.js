import { format, compareAsc } from 'date-fns';

var weekday = new Array(7);
weekday[0] = 'SUNDAY';
weekday[1] = 'MONDAY';
weekday[2] = 'TUESDAY';
weekday[3] = 'WEDNESDAY';
weekday[4] = 'THURSDAY';
weekday[5] = 'FRIDAY';
weekday[6] = 'SATURDAY';

const times = {
  convertLongToHour(time) {
    try {
      const hour = Math.floor(time / 60);
      let second = time % 60;
      if (second < 10) second = '0' + second;

      return hour + ':' + second;
    } catch {
      return '';
    }
  },

  convertHourToLong(time) {
    if (time) {
      const split = time.split(':');
      const result = parseInt(split[0]) * 60 + parseInt(split[1]);

      return result;
    }

    return 0;
  },

  formatYYYYMMDD(time) {
    if (time)
      // return time.toISOString().slice(0, 10)
      return format(time, process.env.FORMAT_DATE);

    return '';
  },

  convertDayToString(time) {
    if (time) {
      return weekday[time.getDay()];
    }

    return '';
  },

  halfHour() {
    const halfHours = ['00', '30'];
    const start = 8;
    const end = 19;
    var times = [];
    for (i = start; i <= end; i++) {
      for (var j = 0; j < halfHours.length; j++) {
        var time = i + ':' + halfHours[j];
        if (i < 10) {
          time = '0' + time;
        }
        times.push(time);
      }
    }
  },
};

export const DayOfWeek = [
  {
    vi: 'Thứ 2',
    en: 'Monday',
    keyVi: 'T2',
    keyEn: 'Mon',
    key: weekday[1],
  },
  {
    vi: 'Thứ 3',
    en: 'Tuesday',
    keyVi: 'T3',
    keyEn: 'Tue',
    key: weekday[2],
  },
  {
    vi: 'Thứ 4',
    en: 'Wednesday',
    keyVi: 'T4',
    keyEn: 'Wed',
    key: weekday[3],
  },
  {
    vi: 'Thứ 5',
    en: 'Thursday',
    keyVi: 'T5',
    keyEn: 'Thu',
    key: weekday[4],
  },
  {
    vi: 'Thứ 6',
    en: 'Friday',
    keyVi: 'T6',
    keyEn: 'Fri',
    key: weekday[5],
  },
  {
    vi: 'Thứ 7',
    en: 'Saturday',
    keyVi: 'T7',
    keyEn: 'Sat',
    key: weekday[6],
  },
  {
    vi: 'Chủ nhật',
    en: 'Sunday',
    keyVi: 'CN',
    keyEn: 'Sun',
    key: weekday[0],
  },
];

export default times;
