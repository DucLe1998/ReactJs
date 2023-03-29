import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import LabelInput from 'components/TextInput/element/LabelInput';
import React from 'react';

const CtSelectBox = ({
  data,
  onValueChanged,
  label,
  value,
  marginBottom,
  ...props
}) => (
  <div style={{ width: '100%', marginBottom: marginBottom || 16 }}>
    <LabelInput label={label} />
    <Autocomplete
      {...props}
      id="combo-box-setting"
      value={value}
      options={data || []}
      disableClearable
      getOptionLabel={(option) => option.label || ''}
      getOptionSelected={(option, selected) =>
        option?.value === selected?.value
      }
      onChange={(e, value) => {
        onValueChanged(value);
      }}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" size="small" />
      )}
    />
  </div>
);

export default CtSelectBox;
