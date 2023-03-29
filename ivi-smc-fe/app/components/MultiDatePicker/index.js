/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { DatePicker } from '@material-ui/pickers';
import { format, isSameDay, setYear } from 'date-fns';
import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  header: {
    height: '48px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeWrapper: {
    height: '257px',
    overflow: 'overlay',
    textAlign: 'center',
    '& > *': {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
  },
}));
export default function MultiDatePicker({ value = [], onChange, year = true }) {
  const [last, setLast] = useState(value[0]);
  const leap = 2020;
  const classes = useStyles();
  const handleChange = (newDate) => {
    const dateClone = year ? newDate : setYear(newDate, leap);
    const dataClone = year ? value : value.map((v) => setYear(v, leap));
    const hasDate = dataClone.find((d) => isSameDay(dateClone, d));
    setLast(newDate);
    if (hasDate) {
      onChange(dataClone.filter((d) => !isSameDay(dateClone, d)));
    } else {
      onChange([...dataClone, dateClone]);
    }
  };

  function renderDay(day, selectedDate, dayInCurrentMonth, dayComponent) {
    const dateClone = year ? day : setYear(day, leap);
    const dataClone = year ? value : value.map((v) => setYear(v, leap));
    const isSelected = dataClone.some((selectedDay) =>
      isSameDay(selectedDay, dateClone),
    );
    return React.cloneElement(dayComponent, {
      ...dayComponent.props,
      selected: isSelected,
    });
  }
  function onDelete(index) {
    const newState = value.filter((d, i) => i != index);
    onChange(newState);
  }
  return (
    <div className={classes.container}>
      <DatePicker
        variant="static"
        value={last}
        onChange={handleChange}
        renderDay={renderDay}
        disableToolbar
      />
      <div style={{ flex: 1 }}>
        <div className={classes.header}>Ngày đã chọn</div>
        <div className={classes.timeWrapper}>
          {React.Children.toArray(
            value.map((d, i) => (
              <Chip
                label={year ? format(d, 'dd/MM/yyyy') : format(d, 'dd/MM')}
                color="primary"
                onDelete={() => onDelete(i)}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}
