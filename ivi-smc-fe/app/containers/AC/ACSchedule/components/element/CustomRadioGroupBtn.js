import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';

const CustomRadioGroupBtn = ({ onChange, name, radioBtns, value }) => (
  <RadioGroup
    row
    aria-label={name}
    name={name}
    value={value || 'WEEKLY'}
    onChange={onChange}
  >
    {(radioBtns || []).map((defs) => (
      <FormControlLabel
        key={defs.value}
        value={defs.value}
        control={<Radio color="primary" />}
        label={defs.label}
      />
    ))}
  </RadioGroup>
);
export default CustomRadioGroupBtn;
