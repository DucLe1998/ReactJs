import React, { useState } from 'react';
import { DialogActions, Grid, TextField } from '@material-ui/core';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { STATUS_FILTER_DOOR } from '../constants';

export const FilterUser = ({ onClose, callback, valueFilter }) => {
  const classes = useStyles();

  const foundStatus =
    valueFilter?.status &&
    STATUS_FILTER_DOOR.find((e) => e.value == valueFilter.status);

  const [dataFilter, setDataFilter] = useState({
    status: foundStatus || STATUS_FILTER_DOOR[0],
  });

  const onSubmit = () => {
    callback(dataFilter);
    onClose();
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.status}
            options={STATUS_FILTER_DOOR}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, status: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions style={{ marginTop: 36 }}>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess onClick={onSubmit}>Lọc</BtnSuccess>
      </DialogActions>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    padding: '0px 10px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& .MuiInputBase-input': {
      boxSizing: 'border-box',
      height: '100%',
    },
    '& .MuiPaper-rounded': {
      borderRadius: '8px',
    },
    '& .MuiDialogActions-root': {
      padding: '32px',
    },
  },
  label: {
    fontWeight: '500',
    height: '17px',
    lineHeight: '16px',
    fontSize: '14px',
    color: '#999999',
    margin: '5px 0',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    outline: 'none',
    lineHeight: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '104px',
    boxSizing: 'border-box',
  },
  iconBtnHeader: {
    backgroundColor: 'rgba(116, 116, 128, 0.08)',
    height: 36,
    width: 36,
    borderRadius: 6,
  },
  popup: {
    zIndex: '1299 !important',
    '& .dx-popup-content': {
      padding: '0px 36px',
    },
    '& .title': {
      padding: '0px',
    },
  },
  uploadImageContainer: {
    width: '100%',
    borderRadius: '12px',
    height: '186px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default FilterUser;
