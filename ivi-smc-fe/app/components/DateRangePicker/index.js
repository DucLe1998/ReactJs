import { InputAdornment, OutlinedInput, IconButton } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarTodayOutlined';
import React from 'react';
import DatePicker from 'react-multi-date-picker';
// import 'react-multi-date-picker/styles/colors/green.css';

export default function DateRangePicker(props) {
  const defaultProps = {
    locale: viLocale,
    format: 'DD/MM/YYYY',
    range: true,
    render: <CustomRangeInput />,
    // className: 'green',
    arrow: false,
    portal: true,
  };
  const mProps = { ...defaultProps, ...props };
  const handleChange = (e) => {
    if (mProps.onChange) {
      const newVal = e.map((e) => e.toDate());
      mProps.onChange(newVal);
    }
  };
  return <DatePicker {...mProps} onChange={handleChange} />;
}
function CustomRangeInput(props) {
  const { openCalendar, value = [] } = props;
  const from = value[0] || '';
  const to = value[1] || '';

  const textValue = from && to ? `${from} ~ ${to}` : from;

  return (
    <OutlinedInput
      onFocus={openCalendar}
      value={textValue}
      placeholder="Chọn ngày"
      readOnly
      fullWidth
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={openCalendar} size="small">
            <CalendarTodayIcon />
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
const viLocale = {
  name: 'gregorian_en_vi',
  months: [
    ['Tháng 1', 'T1'],
    ['Tháng 2', 'T2'],
    ['Tháng 3', 'T3'],
    ['Tháng 4', 'T4'],
    ['Tháng 5', 'T5'],
    ['Tháng 6', 'T6'],
    ['Tháng 7', 'T7'],
    ['Tháng 8', 'T8'],
    ['Tháng 9', 'T9'],
    ['Tháng 10', 'T10'],
    ['Tháng 11', 'T11'],
    ['Tháng 12', 'T12'],
  ],
  weekDays: [
    ['saturday', 'T7'],
    ['sunday', 'CN'],
    ['monday', 'T2'],
    ['tuesday', 'T3'],
    ['wednesday', 'T4'],
    ['thursday', 'T5'],
    ['friday', 'T6'],
  ],
  digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  meridiems: [
    ['AM', 'am'],
    ['PM', 'pm'],
  ],
};
