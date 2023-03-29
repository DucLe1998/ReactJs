import React from 'react';
import { InputAdornment } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import CalendarTodayIcon from '@material-ui/icons/CalendarTodayOutlined';

export default function Date(props) {
  const defaultProps = {
    fullWidth: true,
    inputVariant: 'outlined',
    format: 'dd/MM/yyyy',
    variant: 'inline',
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <CalendarTodayIcon />
        </InputAdornment>
      ),
    },
  };
  const merge = { ...defaultProps, ...props };
  return <DatePicker {...merge} />;
}
