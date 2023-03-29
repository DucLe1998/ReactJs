import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { Controller } from 'react-hook-form';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useStyles } from '../styled';

const CustomSelect = ({
  control,
  errors,
  name,
  showloading,
  handleChange,
  ...otherParams
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        render={props => (
          <Autocomplete
            {...otherParams}
            value={props.value}
            className={classes.autocomplete}
            onChange={(e, value) => {
              props.onChange(value);
              // eslint-disable-next-line no-unused-expressions
              handleChange && handleChange(value?.id || null);
            }}
            loading={showloading}
            loadingText="Đang tải ..."
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                error={!!errors[name]}
                helperText={errors[name] && errors[name].message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {showloading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        )}
      />
    </React.Fragment>
  );
};
export default CustomSelect;
