import { TextField } from '@material-ui/core';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useStyles } from '../style';

const CustomTextField = ({ control, errors, name, ...otherParams }) => {
  const classes = useStyles();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      render={(props) => (
        <TextField
          {...otherParams}
          className={classes.textField}
          error={!!errors[name]}
          helperText={errors[name] && errors[name].message}
          variant="outlined"
          value={props.value || ''}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          fullWidth
        />
      )}
    />
  );
};
export default CustomTextField;
