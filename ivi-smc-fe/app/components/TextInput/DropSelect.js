/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { MenuProps, useStyles } from './element/StyleDropdown';
import LabelInput from './element/LabelInput';

function DropSelect({ data, label, callback, defaultValue }) {
  const classes = useStyles();

  const [selected, setSelected] = useState(defaultValue || []);
  const isAllSelected = data.length > 0 && selected.length === data.length;

  const handleChange = event => {
    const { value } = event.target;
    if (value[value.length - 1] === 'all') {
      setSelected(selected.length === data.length ? [] : data);
      return;
    }

    const aaa = value.filter(e => e.value === value[value.length - 1].value);
    if (aaa && aaa.length >= 2) {
      setSelected(value.filter(e => e.value !== aaa[0].value));
    } else {
      setSelected(value);
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    callback && callback(selected);
  }, [selected]);

  return (
    <div
      style={{
        width: '100%',
        marginBottom: 16,
      }}
    >
      <LabelInput label={label} />
      <Select
        style={{
          width: '100%',
          height: 40,
          borderRadius: 6,
          // overflow: 'hidden',
          border: `1px solid rgba(0, 0, 0, ${
            selected.length > 0 ? 0.48 : 0.12
          })`,
        }}
        labelId="mutiple-select-label"
        multiple
        // variant="outlined"
        value={selected}
        onChange={handleChange}
        renderValue={selected => selected.map(e => e.name).join(', ')}
        MenuProps={MenuProps}
        inputProps={{
          classes: { select: classes.select },
        }}
        disableUnderline
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : '',
          }}
        >
          <ListItemIcon>
            <Checkbox
              classes={{ indeterminate: classes.indeterminateColor }}
              checked={isAllSelected}
              color="primary"
              indeterminate={
                selected.length > 0 && selected.length < data.length
              }
            />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="Tất cả"
          />
        </MenuItem>
        {data.map(e => {
          const check = selected.find(i => i.value === e.value);
          return (
            <MenuItem key={e.name} value={e}>
              <ListItemIcon>
                <Checkbox color="primary" checked={!!check} />
              </ListItemIcon>
              <ListItemText primary={e.name} />
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}

export default DropSelect;
