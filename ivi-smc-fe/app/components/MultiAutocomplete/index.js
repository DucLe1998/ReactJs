import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Checkbox, OutlinedInput } from '@material-ui/core';
export default function MultiAutocomplete(props) {
  const { multiple = true, placeholder = '', ...other } = props;
  const defaultProps = {
    size: 'small',
    disableCloseOnSelect: multiple,
    getOptionLabel: (option) => option.name || '',
    noOptionsText: 'Không có dữ liệu',
    renderInput: (params) => (
      <OutlinedInput
        ref={params.InputProps.ref}
        inputProps={params.inputProps}
        {...params.InputProps}
        fullWidth
        margin="dense"
        placeholder={placeholder}
      />
    ),
  };
  const mProps = { ...defaultProps, ...other };
  if (multiple && !mProps.renderOption) {
    mProps.renderOption = (option, { selected }) => (
      <>
        <Checkbox
          style={{ marginRight: 8 }}
          checked={selected}
          color="primary"
        />
        {mProps.getOptionLabel(option)}
      </>
    );
  }
  return <Autocomplete {...mProps} multiple={multiple} />;
}
