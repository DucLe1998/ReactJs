import React, { useState } from 'react';
import { DialogActions, Grid, TextField } from '@material-ui/core';
import CtDropDownTree from 'components/Custom/AreaTree/CtDropDownTree';
// import { STATUS_FILTER } from 'containers/ListStaff/constants';
import BtnCancel from 'components/Button/BtnCancel';
import BtnSuccess from 'components/Button/BtnSuccess';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

const USER_TYPE = [
  { value: null, label: 'Tất cả' },
  // { value: 'EMPLOYEE', label: 'Nhân viên' },
  { value: 'RESIDENT', label: 'Chủ nhà' },
  { value: 'GUEST', label: 'Khách' },
];

export const FilterUserInDevice = ({ onClose, callback, data }) => {
  const classes = useStyles();

  const [dataFilter, setDataFilter] = useState({
    userType: data?.userType || USER_TYPE[0],
    // status: data?.status || STATUS_FILTER[0],
  });

  const [userGroup, setUserGroup] = useState(data?.userGroup || '');

  const onSubmit = () => {
    const dto = {
      ...dataFilter,
      userGroup,
    };
    callback(dto);
    onClose();
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Phân loại</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.userType}
            options={USER_TYPE}
            disableClearable
            getOptionLabel={(option) => option.label}
            getOptionSelected={(option, selected) =>
              option.value === selected.value
            }
            onChange={(e, value) => {
              setDataFilter((e) => ({ ...e, userType: value }));
            }}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} />
        <Grid item xs={12} sm={6}>
          <div style={{ marginTop: 4 }}>
            <CtDropDownTree
              selectionMode="single"
              api="user-groups"
              label="Nhóm người dùng"
              value={userGroup}
              onValueChanged={(newVal) => {
                setUserGroup(newVal);
              }}
            />
          </div>
        </Grid>

        <Grid item xs={12} sm={6}>
          <p className={classes.label}>Trạng thái</p>
          <Autocomplete
            id="combo-box-setting"
            value={dataFilter.status}
            // options={STATUS_FILTER}
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

export default FilterUserInDevice;
