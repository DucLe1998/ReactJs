import React, { useState } from 'react';
import { DialogActions, Grid, TextField } from '@material-ui/core';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DateBox } from 'devextreme-react';

export const DEVICE_TYPE = [
  { value: null, label: 'Tất cả' },
  { value: 'ACCESS', label: 'Ra/Vào' },
  { value: 'ELEVATOR', label: 'Thang máy' },
];

const STATUS_FILTER = [
  { value: null, label: 'Tất cả' },
  { value: 'UNDEPLOY', label: 'Chưa triển khai' },
  { value: 'DEPLOY', label: 'Đang triển khai' },
  { value: 'COMPLETE', label: 'Hoàn thành' },
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'ERROR', label: 'Lỗi' },
];

export const FilterFirmware = ({ onClose, callback, valueFilter }) => {
  const classes = useStyles();

  const [dataFilter, setDataFilter] = useState({
    deviceType: DEVICE_TYPE[0],
    status: STATUS_FILTER[0],
    // status: valueFilter?.status || STATUS_FILTER[0],
  });

  const onSubmit = () => {
    callback(dataFilter);
    onClose();
  };

  console.log('valueFilter-------------->', valueFilter);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Loại thiết bị</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.deviceType}
            options={DEVICE_TYPE}
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
          <p className={classes.label}>Trạng thái</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.status}
            options={STATUS_FILTER}
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
        <Grid item xs={12} md={6}>
          <DateBox
            type="datetime"
            onValueChanged={(e) => e.value}
            useMaskBehavior
            placeholder="Chọn ngày giờ"
            displayFormat="dd/MM/yyyy HH:mm"
            name="date"
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

export default FilterFirmware;
