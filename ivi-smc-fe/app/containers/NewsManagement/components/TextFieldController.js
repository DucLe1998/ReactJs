import { Controller } from 'react-hook-form';
import React from 'react';
import {
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
} from '@material-ui/core';
import { useStyles } from '../styles';

const TextFieldController = props => {
  const {
    required = false,
    control,
    label,
    maxLength = 0,
    name,
    handleChange,
    disabled,
    placeholder,
    error,
    type = 'text',
    ...otherProps
  } = props;
  const classes = useStyles();
  return (
    <Controller
      {...otherProps}
      control={control}
      name={name}
      defaultValue=""
      rules={{ required }}
      render={controlProps => (
        <Grid container direction="column">
          <p className={classes.label}>
            {label}
            {maxLength ? ` (${controlProps.value?.length}/${maxLength})` : ''}
            {required ? <span style={{ color: 'red' }}>*</span> : ''}
          </p>
          <FormControl error={error}>
            <OutlinedInput
              disabled={disabled}
              placeholder={placeholder}
              value={controlProps.value || ''}
              className={classes.input}
              onChange={e => {
                if (type !== 'number') {
                  controlProps.onChange(e.target.value);
                  return;
                }
                // when type = number only accept positive number
                const input = e.target.value;
                if (
                  !input ||
                  (input[input.length - 1].match('[0-9]') &&
                    input[0].match('[1-9]'))
                ) {
                  if (handleChange) {
                    handleChange(input);
                    return;
                  }
                  controlProps.onChange(input);
                }
              }}
              inputProps={maxLength ? { maxLength } : {}}
            />
            {error && (
              <FormHelperText>Trường thông tin bắt buộc</FormHelperText>
            )}
          </FormControl>
        </Grid>
      )}
    />
  );
};
export default React.memo(TextFieldController);
