import React from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  OutlinedInput,
  Select,
  MenuItem,
} from '@material-ui/core';
export default function TextField({
  error,
  helperText,
  label,
  required,
  children,
  lookup,
  ...other
}) {
  const defaultRender = () => {
    if (lookup) {
      return (
        <Select {...other} variant="outlined">
          {React.Children.toArray(
            lookup.map((item) => (
              <MenuItem value={item?.value || item}>
                {item?.label || item}
              </MenuItem>
            )),
          )}
        </Select>
      );
    }
    return <OutlinedInput {...other} />;
  };
  return (
    <FormControl size="small" margin="dense" fullWidth error={error}>
      <FormLabel required={required}>{label || <>&nbsp;</>}</FormLabel>
      {children || defaultRender()}
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}
