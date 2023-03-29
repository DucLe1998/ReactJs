import clsx from 'clsx';
import {
  format,
  isValid,
  isSameDay,
  endOfWeek,
  startOfWeek,
  isWithinInterval,
} from 'date-fns';
import vi from 'date-fns/locale/vi';
import React from 'react';
import { DatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Typography } from '@material-ui/core';
const localeOptions = {
  locale: vi,
};

const useStyles = makeStyles(theme => ({
  dayWrapper: {
    position: 'relative',
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: 'inherit',
    padding: 0,
  },
  customDayHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '2px',
    right: '2px',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '50%',
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
  },
  highlightNonCurrentMonthDay: {
    color: '#676767',
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  firstHighlight: {
    extend: 'highlight',
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  },
  endHighlight: {
    extend: 'highlight',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  },
}));

export default function WeekPicker(props) {
  const { value, onChange, ...other } = props;
  const classes = useStyles();
  const handleWeekChange = date => {
    onChange(startOfWeek(date, localeOptions), endOfWeek(date, localeOptions));
  };

  const formatWeekSelectLabel = (date, invalidLabel) => {
    const dateClone = date;
    const startDate = startOfWeek(dateClone, localeOptions);
    const endDate = endOfWeek(dateClone, localeOptions);
    const formatStartDate = format(startDate, 'dd/MM/yyyy', localeOptions);
    const formatEndDate = format(endDate, 'dd/MM/yyyy', localeOptions);
    return dateClone && isValid(dateClone)
      ? `${formatStartDate} - ${formatEndDate}`
      : invalidLabel;
  };

  const renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
    const dateClone = date;
    const selectedDateClone = selectedDate;

    const start = startOfWeek(selectedDateClone, localeOptions);
    const end = endOfWeek(selectedDateClone, localeOptions);

    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const isFirstDay = isSameDay(dateClone, start);
    const isLastDay = isSameDay(dateClone, end);

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <Typography variant="body2">{format(dateClone, 'd')}</Typography>
        </IconButton>
      </div>
    );
  };

  return (
    <DatePicker
      value={value}
      onChange={handleWeekChange}
      renderDay={renderWrappedWeekDay}
      labelFunc={formatWeekSelectLabel}
      {...other}
    />
  );
}
