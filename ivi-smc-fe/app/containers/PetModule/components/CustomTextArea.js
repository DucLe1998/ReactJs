import { FormHelperText, TextareaAutosize, TextField } from '@material-ui/core';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useStyles } from '../styled';

const CustomTextArea = ({ control, errors, name, ...otherParams }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Controller
        control={control}
        name={name}
        render={props => (
          <div className={classes.textAreaContainer}>
            <TextareaAutosize
              {...otherParams}
              style={{
                width: '100%',
                borderColor: `${errors[name] ? '#f44336' : ''}`,
              }}
              value={props.value || ''}
              onChange={e => {
                props.onChange(e.target.value);
              }}
            />
          </div>
        )}
      />
      {errors[name] && (
        <FormHelperText style={{ color: '#f44336' }}>
          {errors[name].message}
        </FormHelperText>
      )}
    </React.Fragment>
  );
};
export default CustomTextArea;
