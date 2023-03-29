import React, { useState } from 'react';
import { DialogActions, Grid, TextField } from '@material-ui/core';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  DEVICE_TYPE_DEVICE,
  STATUS_FILTER_DEVICE,
  VECTOR_IN_OUT,
} from '../constants';

const DEVICE_POSITION = [
  { value: null, label: 'Tất cả' },
  { value: 'false', label: 'Chưa gán' },
  { value: 'true', label: 'Đã gán' },
];

export const FilterUser = ({ onClose, callback, valueFilter }) => {
  const classes = useStyles();

  const [checkDefault, setCheckDefault] = useState(false);

  const foundDeviceType =
    valueFilter?.deviceType &&
    DEVICE_TYPE_DEVICE.find((e) => e.value == valueFilter.deviceType);

  const foundDevicePosition =
    valueFilter?.devicePosittion &&
    DEVICE_POSITION.find((e) => e.value == valueFilter.devicePosittion);

  const foundStatus =
    valueFilter?.status &&
    STATUS_FILTER_DEVICE.find((e) => e.value == valueFilter.status);

  const foundDirection =
    valueFilter?.direction &&
    VECTOR_IN_OUT.find((e) => e.value == valueFilter.direction);

  const [dataFilter, setDataFilter] = useState({
    deviceType: foundDeviceType || DEVICE_TYPE_DEVICE[0],
    devicePosittion: foundDevicePosition || DEVICE_POSITION[0],
    status: foundStatus || STATUS_FILTER_DEVICE[0],
    direction: foundDirection || VECTOR_IN_OUT[0],
  });

  const onSubmit = () => {
    callback(dataFilter);
    onClose();
  };

  const onDefault = () => {
    setCheckDefault(true);
    setDataFilter({
      deviceType: DEVICE_TYPE_DEVICE[0],
      devicePosittion: DEVICE_POSITION[0],
      status: STATUS_FILTER_DEVICE[0],
      direction: VECTOR_IN_OUT[0],
    });
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Loại thiết bị</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.deviceType}
            options={DEVICE_TYPE_DEVICE}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, deviceType: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Vị trí</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.devicePosittion}
            options={DEVICE_POSITION}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, devicePosittion: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.status}
            options={STATUS_FILTER_DEVICE}
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
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Chiều định danh</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.direction}
            options={VECTOR_IN_OUT}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, direction: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
      </Grid>
      <DialogActions style={{ marginTop: 36 }}>
        <BtnCancel onClick={onDefault}>Mặc định</BtnCancel>
        <BtnCancel onClick={onClose}>Hủy</BtnCancel>
        <BtnSuccess bgColor={checkDefault && 'green'} onClick={onSubmit}>
          {checkDefault ? 'Lưu' : 'Lọc'}
        </BtnSuccess>
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
